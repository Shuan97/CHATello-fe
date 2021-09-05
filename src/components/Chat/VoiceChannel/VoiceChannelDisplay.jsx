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
          height: { min: 480, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        // video: true,
        audio: true,
      })
      .then((currentStream) => {
        !stream && setStream(currentStream);
      })
      .catch((err) => {
        console.error(err);
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
      <Videos id='videos'>
        <VideoContainer>
          {stream && <Video ref={myVideo} autoPlay playsInline muted />}
          <VideoDescription>Test</VideoDescription>
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
  position: relative;
  width: 100%;
  height: 100%;
  margin: 8px;
  border: 2px solid #1b1b1b;
  border-radius: 12px;
  object-fit: cover;
`;
const VideoDescription = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: #2c2c2c;
  color: #ececec;
  margin: 8px;
  border: 2px solid #1b1b1b;
  border-bottom-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 8px 16px;
  font-weight: bold;
`;

export default VoiceChannelDisplay;
