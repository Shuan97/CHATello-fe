import { SocketContext } from "components/Chat/VoiceChannel/VoiceChannelContextProvider";
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const VoiceChannelDisplay = ({ channelUUID, channelName }) => {
  const { disconnectChannel, joinChannel, setStream, stream } = useContext(
    SocketContext
  );

  const myVideo = useRef();

  useEffect(() => {
    joinChannel({ channelUUID, channelName });
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 640, ideal: 1920 },
          height: { min: 360, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: true,
      })
      .then((currentStream) => {
        !stream && setStream(currentStream);
      });

    return () => {
      // stopBothVideoAndAudio();
      disconnectChannel({ channelUUID, channelName });
      console.log("Cleanup!");
    };
  }, [channelUUID]);

  useEffect(() => {
    if (!!stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideosWrapper>
      <Videos>
        <VideoContainer>
          {stream && <Video ref={myVideo} autoPlay playsInline muted />}
        </VideoContainer>
        {/* <VideoContainer>
          {stream && <Video ref={myVideo} autoPlay playsInline muted />}
        </VideoContainer> */}
      </Videos>
    </VideosWrapper>
  );
};

const VideosWrapper = styled.div`
  overflow: auto;
`;

const Videos = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
`;
const VideoContainer = tw.div`flex-center relative overflow-hidden p-2`;
const Video = styled.video.attrs({
  className: "box-shadow",
})`
  width: 100%;
  height: 100%;
  margin: 8px;
  border: 2px solid #1b1b1b;
  border-radius: 12px;
  object-fit: cover;
`;

export default VoiceChannelDisplay;
