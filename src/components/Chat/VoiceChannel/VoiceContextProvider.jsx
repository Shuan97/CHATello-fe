import { setChannelParticipants } from "features/channelsSlice";
import { selectUser } from "features/userSlice";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { PeerConnection } from "utils/peerConnection";

const SocketContext = createContext();

const getHostUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "https://192.168.0.178:3200";
  } else {
    return "https://chatello.herokuapp.com";
  }
};

// const socket = io(`${getHostUrl()}/broadcast`);

let _stream = null;
const _peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};
const _peerConnections = {};

const VoiceContextProvider = ({ children }) => {
  // const peerConnection = new PeerConnection();

  const [stream, setStream] = useState(null);
  const [joinedCall, setJoinedCall] = useState(false);
  const [joinedVideoCall, setJoinedVideoCall] = useState(false);
  const [me, setMe] = useState("");
  const [room, setRoom] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // no idea how to better stop devices from listening
  _stream = stream;
  window.stream = stream;

  // useState for socket to prevent instantiation of connection before component is loaded
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(`${getHostUrl()}/broadcast`));
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    console.log("PeerConnection");
    // setPeerConnection(new PeerConnection(user, socket));
  }, [socket, user]);

  useEffect(() => {
    if (!stream) return;
    // setLocalStream(stream);
  }, [stream]);

  // useEffect(() => {
  //   console.log("room", room);
  // }, [room]);
  // useEffect(() => {
  //   console.log("joinedCall", joinedCall);
  // }, [joinedCall]);

  useEffect(() => {
    if (!socket || !user || !stream) return;
    // socket.emit(
    //   "peer-connection",
    //   JSON.stringify({
    //     displayName: user.name,
    //     uuid: user.UUID,
    //     dest: "all",
    //   })
    // );
  }, [socket, user, stream]);

  useEffect(() => {
    if (!socket) return;
    socket.on("me", (id) => {
      setMe(id);
      // console.log("Me id: ", id);
    });
    socket.on("update-user-list", (data) => {
      console.log("update-user-list: ", data);
      setTimeout(() => {
        dispatch(
          setChannelParticipants({
            participants: data.users,
          })
        );
      }, 100);
    });
    socket.on("user-joined-channel", (data) => {
      console.log("user-joined-channel: ", data);
      // peerConnection.gotMessageFromServer(data);
    });
  }, [socket]);

  // useEffect(() => {
  //   if (!socket || !peerConnection) return;
  //   socket.on("peer-connection", (data) => {
  //     // console.log("peer-connection: ", data);
  //     peerConnection.gotMessageFromServer(data);
  //   });
  // }, [peerConnection]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.on("peer-connection", (data) => {
      gotMessageFromServer(data);
    });
  }, [socket, user]);

  const stopBothVideoAndAudio = () => {
    !!_stream &&
      _stream.getTracks().forEach(function (track) {
        if (track.readyState == "live") {
          track.stop();
        }
      });
  };

  const joinChannel = ({ channelUUID, channelName }) => {
    if (!joinedCall) {
      console.log("User connected");
      setJoinedCall(true);
      getUserMedia();
    } else {
      const { channelUUID: uuid, channelName: name } = room;
      disconnectChannel({ channelUUID: uuid, channelName: name }, true);
    }
    setRoom({ channelUUID, channelName });
    socket.emit("join-channel", {
      channelUUID: channelUUID,
      channelName: channelName,
      userUUID: user.UUID,
      userName: user.name,
    });
    socket.emit(
      "peer-connection",
      JSON.stringify({
        displayName: user.name,
        channel: channelUUID,
        uuid: user.UUID,
        dest: "all",
      })
    );
  };

  const joinVideoCall = ({ channelUUID, channelName }) => {
    if (!joinedVideoCall) {
      console.log("User video connected");
      setJoinedVideoCall(true);
    } else {
      const { uuid, name } = room;
      // disconnectChannel({ channelUUID: uuid, channelName: name }, true);
    }
    setRoom(channelUUID);
    socket.emit("join-channel", {
      channelUUID: channelUUID,
      channelName: channelName,
      userUUID: user.UUID,
      userName: user.name,
    });
    socket.emit(
      "peer-connection",
      JSON.stringify({
        displayName: user.name,
        channel: channelUUID,
        uuid: user.UUID,
        dest: "all",
      })
    );
  };

  const disconnectChannel = (
    { channelUUID, channelName },
    changingChannel = false
  ) => {
    if (!changingChannel) {
      setJoinedCall(false);
      setRoom(null);
      console.log("User disconnected");
    } else {
      console.log("User changing channel");
    }
    socket.emit("disconnect-channel", {
      channelUUID: channelUUID,
      channelName: channelName,
      userUUID: user.UUID,
      userName: user.name,
    });
  };

  const getUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 640, ideal: 1920 },
          height: { min: 480, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        // video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // ===================
  const gotMessageFromServer = (message) => {
    var signal = JSON.parse(message);
    var peerUuid = signal.uuid;

    // Ignore messages that are not for us or from ourselves
    if (
      peerUuid == user.UUID ||
      (signal.dest != user.UUID && signal.dest != "all")
    )
      return;

    if (signal.displayName && signal.dest == "all") {
      // set up peer connection object for a newcomer peer
      // console.log("Setting up peer connection");
      setUpPeer(peerUuid, signal.displayName);
      socket.emit(
        "peer-connection",
        JSON.stringify({
          displayName: user.name,
          uuid: user.UUID,
          dest: peerUuid,
        })
      );
    } else if (signal.displayName && signal.dest == user.UUID) {
      // initiate call if we are the newcomer peer
      // console.log("Starting call");
      setUpPeer(peerUuid, signal.displayName, true);
    } else if (signal.sdp) {
      _peerConnections[peerUuid].pc
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          // Only create answers in response to offers
          if (signal.sdp.type == "offer") {
            _peerConnections[peerUuid].pc
              .createAnswer()
              .then((description) => createdDescription(description, peerUuid))
              .catch(errorHandler);
          }
        })
        .catch(errorHandler);
    } else if (signal.ice) {
      // console.log("signal ice", signal.ice);
      _peerConnections[peerUuid].pc
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch(errorHandler);
    }
  };

  const setUpPeer = (peerUuid, displayName, initCall = false) => {
    try {
      // console.log("setUpPeer");
      _peerConnections[peerUuid] = {
        displayName: displayName,
        pc: new RTCPeerConnection(_peerConnectionConfig),
      };
      _peerConnections[peerUuid].pc.onicecandidate = (event) =>
        gotIceCandidate(event, peerUuid);
      _peerConnections[peerUuid].pc.ontrack = (event) =>
        gotRemoteStream(event, peerUuid);
      _peerConnections[peerUuid].pc.oniceconnectionstatechange = (event) =>
        checkPeerDisconnect(event, peerUuid);
      _peerConnections[peerUuid].pc.addStream(stream);

      if (initCall) {
        // console.log("initCall");
        _peerConnections[peerUuid].pc
          .createOffer()
          .then((description) => createdDescription(description, peerUuid))
          .catch(errorHandler);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const gotIceCandidate = (event, peerUuid) => {
    // console.log(`gotIceCandidate`);
    if (event.candidate != null) {
      socket.emit(
        "peer-connection",
        JSON.stringify({
          ice: event.candidate,
          uuid: user.UUID,
          dest: peerUuid,
        })
      );
    }
  };

  const createdDescription = (description, peerUuid) => {
    // console.log(`got description, peer ${peerUuid}`);
    _peerConnections[peerUuid].pc
      .setLocalDescription(description)
      .then(() => {
        socket.emit(
          "peer-connection",
          JSON.stringify({
            sdp: _peerConnections[peerUuid].pc.localDescription,
            uuid: user.UUID,
            dest: peerUuid,
          })
        );
      })
      .catch(errorHandler);
  };

  const gotRemoteStream = (event, peerUuid) => {
    // console.log(`got remote stream, peer ${peerUuid}`);
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
    vidContainer.appendChild(makeLabel(_peerConnections[peerUuid].displayName));

    document.getElementById("videos").appendChild(vidContainer);
  };

  const checkPeerDisconnect = (event, peerUuid) => {
    var state = _peerConnections[peerUuid].pc.iceConnectionState;
    // console.log(`connection with peer ${peerUuid} ${state}`);
    if (state === "failed" || state === "closed" || state === "disconnected") {
      console.log(`check peer disconnect`);
      delete _peerConnections[peerUuid];
      document
        .getElementById("videos")
        .removeChild(document.getElementById("remoteVideo_" + peerUuid));
      // updateLayout();
    }
  };

  const makeLabel = (label) => {
    var vidLabel = document.createElement("div");
    vidLabel.appendChild(document.createTextNode(label));
    vidLabel.setAttribute(
      "class",
      "videoLabel absolute bottom-0 left-0 text-white m-2 border-2 border-eerie-500 rounded-xl px-4 py-2 bg-eerie-400 font-bold"
    );
    return vidLabel;
  };

  const errorHandler = (error) => {
    console.log(error);
  };
  // ===================

  return (
    <SocketContext.Provider
      value={{
        disconnectChannel,
        joinChannel,
        joinedCall,
        stream,
        setStream,
        stopBothVideoAndAudio,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };

export default VoiceContextProvider;
