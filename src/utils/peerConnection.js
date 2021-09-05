var localStream;
var constraints = {
  // video: {
  //   width: { max: 320 },
  //   height: { max: 240 },
  //   frameRate: { max: 30 },
  // },
  video: {
    width: { min: 640, ideal: 1920 },
    height: { min: 360, ideal: 1080 },
    aspectRatio: { ideal: 1.7777777778 },
  },
  // video: true,
  audio: true,
};

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      localStream = stream;
      // document.getElementById("localVideo").srcObject = stream;
    })
    .catch((err) => console.error(err));
}

const getLocalStream = () => {
  if (navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => stream)
      .catch((err) => console.error(err));
  }
};

export class PeerConnection {
  _peerConnectionConfig = {
    iceServers: [
      { urls: "stun:stun.stunprotocol.org:3478" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };
  _peerConnections = {};
  // localStream = localStream;
  localStream = getLocalStream();
  socket = null;

  constructor(user, socket) {
    this.user = user;
    this.socket = socket;
    // this.localStream = localStream;

    // this.constraints = {
    //   video: {
    //     width: { max: 320 },
    //     height: { max: 240 },
    //     frameRate: { max: 30 },
    //   },
    //   audio: false,
    // };

    // if (navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices
    //     .getUserMedia(this.constraints)
    //     .then((stream) => {
    //       this.localStream = stream;
    //       // document.getElementById("localVideo").srcObject = stream;
    //     })
    //     .catch(this.errorHandler);
    // }
  }

  setLocalStream(stream) {
    this.localStream = stream;
  }

  gotMessageFromServer(message) {
    var signal = JSON.parse(message);
    var peerUuid = signal.uuid;

    // Ignore messages that are not for us or from ourselves
    if (
      peerUuid == this.user.UUID ||
      (signal.dest != this.user.UUID && signal.dest != "all")
    )
      return;

    if (signal.displayName && signal.dest == "all") {
      // set up peer connection object for a newcomer peer
      // console.log("Setting up peer connection");
      this.setUpPeer(peerUuid, signal.displayName);
      this.socket.emit(
        "peer-connection",
        JSON.stringify({
          displayName: this.user.name,
          uuid: this.user.UUID,
          dest: peerUuid,
        })
      );
    } else if (signal.displayName && signal.dest == this.user.UUID) {
      // initiate call if we are the newcomer peer
      // console.log("Starting call");
      this.setUpPeer(peerUuid, signal.displayName, true);
    } else if (signal.sdp) {
      this._peerConnections[peerUuid].pc
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          // Only create answers in response to offers
          if (signal.sdp.type == "offer") {
            this._peerConnections[peerUuid].pc
              .createAnswer()
              .then((description) =>
                this.createdDescription(description, peerUuid)
              )
              .catch(this.errorHandler);
          }
        })
        .catch(this.errorHandler);
    } else if (signal.ice) {
      // console.log("signal ice", signal.ice);
      this._peerConnections[peerUuid].pc
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch(this.errorHandler);
    }
  }

  setUpPeer(peerUuid, displayName, initCall = false) {
    try {
      // console.log("setUpPeer");
      this._peerConnections[peerUuid] = {
        displayName: displayName,
        pc: new RTCPeerConnection(this._peerConnectionConfig),
      };
      this._peerConnections[peerUuid].pc.onicecandidate = (event) =>
        this.gotIceCandidate(event, peerUuid);
      this._peerConnections[peerUuid].pc.ontrack = (event) =>
        this.gotRemoteStream(event, peerUuid);
      this._peerConnections[peerUuid].pc.oniceconnectionstatechange = (event) =>
        this.checkPeerDisconnect(event, peerUuid);
      this._peerConnections[peerUuid].pc.addStream(localStream);

      if (initCall) {
        console.log("initCall");
        this._peerConnections[peerUuid].pc
          .createOffer()
          .then((description) => this.createdDescription(description, peerUuid))
          .catch(this.errorHandler);
      }
    } catch (error) {
      console.error(error);
    }
  }

  gotIceCandidate(event, peerUuid) {
    // console.log(`gotIceCandidate`);
    if (event.candidate != null) {
      this.socket.emit(
        "peer-connection",
        JSON.stringify({
          ice: event.candidate,
          uuid: this.user.UUID,
          dest: peerUuid,
        })
      );
    }
  }

  createdDescription(description, peerUuid) {
    console.log(`got description, peer ${peerUuid}`);
    console.log(this.socket);
    this._peerConnections[peerUuid].pc
      .setLocalDescription(description)
      .then(() => {
        this.socket.emit(
          "peer-connection",
          JSON.stringify({
            sdp: this._peerConnections[peerUuid].pc.localDescription,
            uuid: this.user.UUID,
            dest: peerUuid,
          })
        );
      })
      .catch(this.errorHandler);
  }

  gotRemoteStream(event, peerUuid) {
    console.log(`got remote stream, peer ${peerUuid}`);
    if (document.getElementById("remoteVideo_" + peerUuid)) return;
    //assign stream to new HTML video element
    var vidElement = document.createElement("video");
    vidElement.setAttribute(
      "class",
      "relative h-full w-full m-2 border-2 border-eerie-500 rounded-xl object-cover box-shadow"
    );
    vidElement.setAttribute("autoplay", "");
    vidElement.setAttribute("muted", "");
    vidElement.srcObject = event.streams[0];

    var vidContainer = document.createElement("div");
    vidContainer.setAttribute("id", "remoteVideo_" + peerUuid);
    vidContainer.setAttribute(
      "class",
      "flex-center relative overflow-hidden p-2"
    );
    vidContainer.appendChild(vidElement);
    vidContainer.appendChild(
      this.makeLabel(this._peerConnections[peerUuid].displayName)
    );

    document.getElementById("videos").appendChild(vidContainer);
  }

  checkPeerDisconnect(event, peerUuid) {
    console.log(`check peer disconnect`);
    var state = this._peerConnections[peerUuid].pc.iceConnectionState;
    console.log(`connection with peer ${peerUuid} ${state}`);
    if (state === "failed" || state === "closed" || state === "disconnected") {
      delete this._peerConnections[peerUuid];
      document
        .getElementById("videos")
        .removeChild(document.getElementById("remoteVideo_" + peerUuid));
      // updateLayout();
    }
  }

  makeLabel(label) {
    var vidLabel = document.createElement("div");
    vidLabel.appendChild(document.createTextNode(label));
    vidLabel.setAttribute(
      "class",
      "videoLabel absolute bottom-0 left-0 text-white m-2 border-2 border-eerie-500 rounded-xl px-4 py-2 bg-eerie-400 font-bold"
    );
    return vidLabel;
  }

  errorHandler(error) {
    console.log(error);
  }
}
