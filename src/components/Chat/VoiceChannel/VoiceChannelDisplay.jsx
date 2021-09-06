import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { SocketContext } from "components/Chat/VoiceChannel/VoiceContextProvider";
import { ChannelTypeEnum } from "constants/enums";
import {
  selectCurrentChannelContext,
  selectCurrentVoiceChannel,
} from "features/channelsSlice";
import { selectUser } from "features/userSlice";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const VoiceChannelDisplay = () => {
  const {
    disconnectChannel,
    joinedCall,
    joinChannel,
    setStream,
    stream,
  } = useContext(SocketContext);
  const [mute, setMute] = useState(true);

  const { UUID: channelUUID, name: channelName } = useSelector(
    selectCurrentVoiceChannel
  );
  const channelContext = useSelector(selectCurrentChannelContext);
  const { name } = useSelector(selectUser);
  const myVideo = useRef();

  useEffect(() => {
    joinChannel({ channelUUID, channelName });

    return () => {
      // disconnectChannel({ channelUUID, channelName });
      console.log("Cleanup!");
    };
  }, [channelUUID]);

  useEffect(() => {
    if (!stream) return;
    myVideo.current.srcObject = stream;
    setMute(myVideo.current.muted);
  }, [stream]);

  useEffect(() => {
    if (!stream) return;
    myVideo.current.muted = mute;
  }, [stream, mute]);

  const handleMute = () => {
    setMute((prev) => !prev);
  };

  return (
    <VideosWrapper
      className={`${channelContext === ChannelTypeEnum.VOICE ? "" : "hidden"}`}
    >
      <Videos id='videos'>
        <VideoContainer>
          {stream && <Video ref={myVideo} autoPlay playsInline muted />}
          <VideoDescription mute={mute ? "true" : "false"}>
            {name}
            {mute ? (
              <MicOffIcon onClick={handleMute} className='mx-4' />
            ) : (
              <MicIcon onClick={handleMute} className='mx-4' />
            )}
          </VideoDescription>
        </VideoContainer>
        {/* <VideoContainer>
          {stream && <Video ref={myVideo} autoPlay playsInline muted />}
        </VideoContainer> */}
      </Videos>
    </VideosWrapper>
  );
};

const VideosWrapper = tw.div`overflow-auto absolute h-full bg-eerie-400`;

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
  border: 2px solid ${({ mute }) => (mute === "false" ? "#1b1b1b" : "red")};
  border-bottom-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 8px 16px;
  font-weight: bold;
`;

export default VoiceChannelDisplay;
