import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PersonIcon from "@material-ui/icons/Person";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import axios, { assest, massageSocket } from "../axios";
import { timeToAgo } from "../someImpFun";
import { Avatar } from "@material-ui/core";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import { NavLink, useHistory } from "react-router-dom";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";

function Post({ help, provider }) {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [postCreator, setpostCreator] = useState({});
  useEffect(() => {
    dispatch(isUserSaved());
    const fetchData = async () => {
      const id = provider ? help?.providerId : help?.requesterId;
      const creator = await (
        await axios.get("/api/auth/getUserById/" + id)
      ).data;
      setpostCreator(creator.send);
    };
    fetchData();
  }, [help, provider, dispatch]);
  const goToChatRoom = async () => {
    const socket = io(massageSocket);
    socket.on("connection", ({ id }) => console.log(id));

    socket.emit("getRoomId", {
      userId: user?._id,
      otherId: postCreator?._id,
    });
    socket.on("roomPresent", ({ roomId }) => {
      console.log(roomId);
      history.push(`/chat/${roomId}`);
    });
  };

  const deleteIt = async () => {
    const x = window.confirm("Did you really want to delete it?");
    if (!x) return;

    const id = help?._id;
    const url = `/api/${provider ? "provide" : "request"}/delete`;
    const d = await (await axios.post(url, { id: id })).data;
    if (d.msg === "ok") {
      window.alert(d.res);
      window.location.reload();
    }
  };

  return (
    <div className="my-3">
      <Box>
        <Top>
          <UserIconWrap>
            <NavLink
              to={`/profile/${
                postCreator?._id === user?._id ? "own" : postCreator?._id
              }`}
              style={{ color: "white" }}
            >
              {postCreator?.profilePic ? (
                <Avatar src={`${assest}${postCreator?.profilePic}`} />
              ) : (
                <PersonIcon />
              )}
            </NavLink>
          </UserIconWrap>
          <PostInfoBox>
            <NavLink
              to={`/profile/${
                postCreator?._id === user?._id ? "own" : postCreator?._id
              }`}
              style={{ color: "white" }}
            >
              <p>{postCreator?.name}</p>
              <p>{timeToAgo(help.time)}</p>
            </NavLink>
          </PostInfoBox>

          <DeletePostIcon
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              position: "relative",
            }}
            onMouseOver={() => {
              const moreOption = document.getElementById(
                `moreOption${help?._id}`
              );
              moreOption.classList.remove("d-none");
            }}
            onMouseLeave={() => {
              const moreOption = document.getElementById(
                `moreOption${help?._id}`
              );
              moreOption.classList.add("d-none");
            }}
          >
            <MoreHorizIcon />
            <div
              className=" d-none"
              id={`moreOption${help?._id}`}
              style={{
                color: "white",
                backgroundColor: "#0779e4",
                position: "absolute",
                top: "50%",
              }}
            >
              <p
                data-toggle="modal"
                data-target={"#shareModalCenter" + help?._id}
              >
                share
              </p>
              {user ? (
                postCreator?._id === user?._id ? (
                  <p onClick={deleteIt}>delete</p>
                ) : (
                  <p
                    data-toggle="modal"
                    data-target={"#reportModalCenter" + help?._id}
                  >
                    report
                  </p>
                )
              ) : null}
            </div>
          </DeletePostIcon>
        </Top>

        <Center>
          <h5>
            {provider
              ? `Need ${help.name}, contact me!!!`
              : `Please Help, we need ${help.name}`}
          </h5>
          <DescBox>{help.desc}</DescBox>

          {help.image !== "" ? (
            <ImageBox>
              <img src={`${assest}${help.image}`} alt="help hand" />
            </ImageBox>
          ) : null}
        </Center>

        {user ? (
          postCreator?._id === user?._id ? null : (
            <div className="d-flex">
              <Bottom onClick={goToChatRoom}>Start Chatting</Bottom>
            </div>
          )
        ) : null}
      </Box>
      <Share help={help} />
      <Report help={help} user={user} />
      <div className="my-5"></div>
    </div>
  );
}

const Share = ({ help }) => {
  const shareUrl = window.location.origin;
  const shareContent = {
    url: shareUrl + "/post/" + help?._id,
    quote:
      "Join help hand and be the part of a fantastic community, full of helpfull peoples.",
    hashTag: "#helpHand #beThePart #doHelpGetHelp",
  };
  return (
    <div
      className="modal fade"
      id={"shareModalCenter" + help?._id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Share
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body d-flex" style={{ padding: "2rem 35%" }}>
            <div>
              <FacebookShareButton
                url={shareContent.url}
                quote={shareContent.quote}
                hashtag={shareContent.hashTag}
              >
                <FacebookIcon round={true} size={32}></FacebookIcon>
              </FacebookShareButton>
            </div>
            <div>
              <WhatsappShareButton
                url={shareContent.url}
                title={shareContent.quote}
              >
                <WhatsappIcon round={true} size={32}></WhatsappIcon>
              </WhatsappShareButton>
            </div>
            <div>
              <TelegramShareButton
                url={shareContent.url}
                title={shareContent.quote}
              >
                <TelegramIcon round={true} size={32}></TelegramIcon>
              </TelegramShareButton>
            </div>
            <div>
              <LinkedinShareButton
                url={shareContent.url}
                title="Join Help hand"
                summary={shareContent.quote}
                source={shareUrl}
              >
                <LinkedinIcon round={true} size={32}></LinkedinIcon>
              </LinkedinShareButton>
            </div>
            <div>
              <TwitterShareButton
                url={shareContent.url}
                title={shareContent.quote}
                hashtags={shareContent.hashTag.split(" ")}
              >
                <TwitterIcon round={true} size={32}></TwitterIcon>
              </TwitterShareButton>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const Report = ({ help, user }) => {
  const [report, setreport] = useState("");
  const submit = async (e) => {
    e.preventDefault();

    const d = await (
      await axios.post("/api/report/report", {
        postId: help?._id,
        doerId: user?._id,
        report: report,
      })
    ).data;

    if (d.msg === "ok") window.alert(d.res);
    else window.alert("Problem in server, please try after some time!!!");
  };
  return (
    <div
      className="modal fade"
      id={"reportModalCenter" + help?._id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <form>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Report
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <label>Report</label>
              <br />
              <textarea
                type="text"
                name="report"
                className="form-control"
                value={report}
                onChange={(e) => setreport(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={submit}
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Submit Report
              </button>
              <button
                type="reset"
                id="reset"
                style={{ display: "none" }}
              ></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Post;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
  max-width: 620px;
  color: white;
  box-shadow: 0 0 3px black;
  border-radius: 7px;
`;

const Top = styled.div`
  display: flex;
  padding: 10px 20px;
  height: 60px;
  background: #0779e4;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

const UserIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 3px solid white;
  border-radius: 50%;
  width: 40px;

  svg {
    transform: scale(1.4);
  }
`;

const PostInfoBox = styled.div`
  align-self: center;
  margin: 0 10px;
  flex: 1;

  p:nth-child(2) {
    font-size: 10px;
  }
`;

const DeletePostIcon = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  color: grey;
  padding: 10px 20px;
  ${
    "" /* border-left: 2px solid grey;
    border-right: 2px solid grey; */
  }
`;

const DescBox = styled.div`
  font-size: 14px;
  color: grey;
`;

const ImageBox = styled.div`
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
  img {
    width: 100%;
  }
`;

const Bottom = styled.div`
  display: flex;
  color: white;
  background: #0779e4;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  padding: 7px 0;
`;
