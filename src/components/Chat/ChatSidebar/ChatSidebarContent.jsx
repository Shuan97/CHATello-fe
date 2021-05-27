import AddRoundedIcon from "@material-ui/icons/AddRounded";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { createChannel, selectTextChannels } from "features/channelsSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import SidebarChannel from "./ChatSidebarChannel";
import Modal from "components/common/Modal/Modal";
import VariantButton from "components/common/VariantButton";
import { variant } from "constants/variant";
import { Form, Formik } from "formik";
import TextInput from "components/common/Form/TextInput";
import * as Yup from "yup";

const textChannelContext = {
  type: "TEXT",
  title: "New text channel",
};

const voiceChannelContext = {
  type: "VOICE",
  title: "New voice channel",
};

const SidebarContent = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectTextChannels);
  const [showModal, setShowModal] = useState(false);
  const [modalContext, setModalContext] = useState({});

  const [validationSchema] = useState(
    Yup.object().shape({
      channelName: Yup.string()
        .required("Channel name is required")
        .min(3, "Name must have at least 3 characters"),
    })
  );

  const handleAddChannel = (type) => {
    setShowModal(true);
    switch (type) {
      case "TEXT":
        setModalContext(textChannelContext);
        break;
      case "VOICE":
        setModalContext(voiceChannelContext);
        break;
      default:
        break;
    }
  };

  const handleSubmit = ({ channelName, type }) => {
    if (!!channelName) {
      dispatch(createChannel({ name: channelName, type: type })).then(() => {
        setShowModal(false);
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <StyledSidebarContent>
      <ChannelHeaderWrapper>
        <ChannelHeader>
          <ExpandMoreRoundedIcon />
          <h2>Text channels</h2>
        </ChannelHeader>
        <AddRoundedIcon
          onClick={() => {
            handleAddChannel("TEXT");
          }}
        />
      </ChannelHeaderWrapper>
      <ChannelsList>
        {channels &&
          channels.length > 0 &&
          channels.map(({ UUID, name }) => (
            <SidebarChannel key={UUID} id={UUID} channelName={name} />
          ))}
      </ChannelsList>

      <ChannelHeaderWrapper>
        <ChannelHeader>
          <ExpandMoreRoundedIcon />
          <h2>Voice channels</h2>
        </ChannelHeader>
        <AddRoundedIcon
          onClick={() => {
            handleAddChannel("VOICE");
          }}
        />
      </ChannelHeaderWrapper>
      <Formik
        initialValues={{
          channelName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit({
            channelName: values.channelName,
            type: modalContext.type,
          });
        }}
      >
        {() => (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form>
              <Modal.Header title={modalContext.title} />
              <Modal.Body>
                <TextInput
                  placeholder='channel name'
                  label='Channel name'
                  name='channelName'
                />
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <VariantButton
                    type='reset'
                    variant={variant.DANGER}
                    text='Cancel'
                    onClick={handleCancel}
                  />
                  <VariantButton
                    type='submit'
                    variant={variant.SUCCESS}
                    text='Create'
                  />
                </div>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
      </Formik>
    </StyledSidebarContent>
  );
};

export default SidebarContent;

const StyledSidebarContent = styled.div`
  height: 100%;
`;

const ChannelHeaderWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};

  svg {
    transition: font-size 100ms linear, color 100ms linear;
    font-size: 1.25rem;
  }
`;

const ChannelHeader = styled.div`
  display: flex;
  flex: 1;

  h2 {
    font-size: 0.875rem;
    margin-left: 0.5rem;
  }
`;

const ChannelsList = styled.div`
  /* border: 2px solid red; */
`;
