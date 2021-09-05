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

const VoiceChannelContextProvider = ({ children }) => {
  // const peerConnection = new PeerConnection();

  const [stream, setStream] = useState(null);
  const [joinedCall, setJoinedCall] = useState(false);
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
    setPeerConnection(new PeerConnection(user, socket));
  }, [socket, user]);

  useEffect(() => {
    if (!stream) return;
    peerConnection.setLocalStream(stream);
  }, [stream]);

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
      console.log("Me id: ", id);
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

  useEffect(() => {
    if (!socket || !peerConnection) return;
    socket.on("peer-connection", (data) => {
      // console.log("peer-connection: ", data);
      peerConnection.gotMessageFromServer(data);
    });
  }, [peerConnection]);

  const stopBothVideoAndAudio = () => {
    !!_stream &&
      _stream.getTracks().forEach(function (track) {
        if (track.readyState == "live") {
          track.stop();
        }
      });
  };

  const joinChannel = ({ channelUUID, channelName }) => {
    setJoinedCall(true);
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
        uuid: user.UUID,
        dest: "all",
      })
    );
  };

  const disconnectChannel = ({ channelUUID, channelName }) => {
    setJoinedCall(false);
    setRoom(null);
    socket.emit("disconnect-channel", {
      channelUUID: channelUUID,
      channelName: channelName,
      userUUID: user.UUID,
      userName: user.name,
    });
    console.log("User disconnected");
  };

  return (
    <SocketContext.Provider
      value={{
        disconnectChannel,
        joinChannel,
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

export default VoiceChannelContextProvider;
