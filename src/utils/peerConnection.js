export class PeerConnection {
  peerConnectionConfig = {
    iceServers: [
      { urls: "stun:stun.stunprotocol.org:3478" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };
  peerConnections = {};

  start() {
    return;
  }

  setUpPeer(peerUuid, displayName, initCall = false) {
    peerConnections[peerUuid] = {
      displayName: displayName,
      pc: new RTCPeerConnection(peerConnectionConfig),
    };
    peerConnections[peerUuid].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerUuid);
    peerConnections[peerUuid].pc.ontrack = (event) =>
      gotRemoteStream(event, peerUuid);
    peerConnections[peerUuid].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerUuid);
    peerConnections[peerUuid].pc.addStream(localStream);

    if (initCall) {
      peerConnections[peerUuid].pc
        .createOffer()
        .then((description) => console.log(description, peerUuid))
        .catch(errorHandler);
    }
  }

  gotIceCandidate(event, peerUuid) {
    if (event.candidate != null) {
      serverConnection.send(
        JSON.stringify({
          ice: event.candidate,
          uuid: localUuid,
          dest: peerUuid,
        })
      );
    }
  }

  gotRemoteStream(event, peerUuid) {
    console.log(`got remote stream, peer ${peerUuid}`);
    //assign stream to new HTML video element
    var vidElement = document.createElement("video");
    vidElement.setAttribute("autoplay", "");
    vidElement.setAttribute("muted", "");
    vidElement.srcObject = event.streams[0];

    var vidContainer = document.createElement("div");
    vidContainer.setAttribute("id", "remoteVideo_" + peerUuid);
    vidContainer.setAttribute("class", "videoContainer");
    vidContainer.appendChild(vidElement);
    vidContainer.appendChild(makeLabel(peerConnections[peerUuid].displayName));

    document.getElementById("videos").appendChild(vidContainer);
  }

  checkPeerDisconnect(event, peerUuid) {
    var state = peerConnections[peerUuid].pc.iceConnectionState;
    console.log(`connection with peer ${peerUuid} ${state}`);
    if (state === "failed" || state === "closed" || state === "disconnected") {
      delete peerConnections[peerUuid];
      document
        .getElementById("videos")
        .removeChild(document.getElementById("remoteVideo_" + peerUuid));
      updateLayout();
    }
  }

  errorHandler(error) {
    console.log(error);
  }
}
