import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import LocationCity from "@material-ui/icons/LocationOn";

import { NavLink, useHistory, useParams } from "react-router-dom";
import { isUserSaved } from "../action";
import { useSelector, useDispatch } from "react-redux";
import axios, { assest, massageSocket } from "../axios";
import Post from "./Post";
import { io } from "socket.io-client";
function Profile() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [owner, setowner] = useState({});
  const { id } = useParams();
  const [findHelp, setfindHelp] = useState([]);
  const [provideHelp, setprovideHelp] = useState([]);
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "own") {
        const own = await (await axios.get("/api/auth/getUserById/" + id)).data;
        setowner(own.send);
      } else {
        setowner(user);
      }
    };
    fetchData();
  }, [id, user]);
  useEffect(() => {
    const fetchData = async () => {
      if (owner?._id === undefined) return;

      let find = await axios.get("/api/request/allRequests/" + owner?._id);
      find = await find.data;
      setfindHelp(find);
      let provide = await axios.get("/api/provide/allProviding/" + owner?._id);
      provide = await provide.data;
      setprovideHelp(provide);
    };
    fetchData();
  }, [owner?._id]);

  const goToChatRoom = async () => {
    const socket = io(massageSocket);
    socket.on("connection");

    socket.emit("getRoomId", {
      userId: user?._id,
      otherId: owner?._id,
    });
    socket.on("roomPresent", ({ roomId }) => {
      console.log(roomId);
      history.push(`/chat/${roomId}`);
    });
  };
  return (
    <Box>
      <ProfileBox>
        <Wrap>
          <Heading>{id === "own" ? "My Profile" : "Profile"}</Heading>
        </Wrap>
        <ProfileWrap>
          <ProfileImgBox>
            <Avatar
              src={assest + owner?.profilePic}
              style={{ width: "10rem", height: "10rem" }}
            />
          </ProfileImgBox>
          <SelfInfoBox>
            <UsernameBox>{owner?.username}</UsernameBox>
            <EmailBox>{owner?.email}</EmailBox>
            <br />
            <p>{owner?.bio}</p>
            <br />
            <p className="d-flex ml-auto">
              <LocationCity />{" "}
              <span>
                {owner?.city}, {owner?.state}-{owner?.pincode}
              </span>
            </p>
            <br />
            {user ? (
              id === "own" ? (
                <NavLink to="/editProfile" className="btn btn-primary w-100">
                  Edit Profile
                </NavLink>
              ) : (
                <div className="d-flex">
                  <button
                    onClick={goToChatRoom}
                    className="btn btn-primary w-100"
                  >
                    Start Chatting
                  </button>
                  <ReqMobileNo owner={owner} user={user} />
                </div>
              )
            ) : null}
          </SelfInfoBox>
        </ProfileWrap>
        {/* owner all help and needs */}
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
              className="nav-item nav-link active"
              id="nav-home-tab"
              data-toggle="tab"
              href="#nav-home"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              <div>Providing </div>
            </a>
            <a
              className="nav-item nav-link"
              id="nav-profile-tab"
              data-toggle="tab"
              href="#nav-profile"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              <div> Needs</div>
            </a>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            {provideHelp.length ? (
              provideHelp.map((help, i) => (
                <Post key={i} provider help={help} />
              ))
            ) : (
              <h1 className="mt-5 pt-5 mx-5">
                You didn't created any help yet!!!
              </h1>
            )}
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            {findHelp.length ? (
              findHelp.map((help, i) => <Post key={i} help={help} />)
            ) : (
              <h1 className="mt-5 pt-5 mx-5">
                You didn't created any request yet!!!
              </h1>
            )}
          </div>
        </div>
      </ProfileBox>
    </Box>
  );
}

const ReqMobileNo = ({ owner, user }) => {
  const [request, setrequest] = useState({});
  useEffect(() => {
    async function fetchData() {
      let req = await axios.get(
        `/api/request/isrequested/${user?._id}/${owner?._id}`
      );
      req = req.data;
      setrequest(req);
    }
    fetchData();
  }, [owner?._id, user?._id]);
  const reqForMobile = async () => {
    if (request.msg === "sent") {
      if (request.accept == true) {
        return;
      } else {
        window.alert("request is sent already");
        return;
      }
    } else {
      try {
        let sendReq = await axios.post("/api/request/reqmobile", {
          requesterId: user?._id,
          accepterId: owner?._id,
        });
        sendReq = sendReq.data;
        window.alert(sendReq.res);
        setrequest({ msg: "sent", accept: false });
      } catch (error) {
        window.alert("server is temparary down!!");
      }
    }
  };
  return (
    <button onClick={reqForMobile} className="btn btn-primary w-100 ml-2">
      {request.msg === "sent" ? (
        request.accept ? (
          <a style={{ color: "white" }} href={`tel:${owner?.mobile}`}>
            Call : {owner?.mobile}
          </a>
        ) : (
          "Request Sent"
        )
      ) : (
        "Request Mobile No."
      )}
    </button>
  );
};

export default Profile;

const Box = styled.div`
  display: flex;
  margin: 30px 10%;
  margin-bottom: 0px;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;

  @media (max-width: 700px) {
    margin: 20px 15px;
    width: 100%;
  }
`;

const ProfileBox = styled.div`
  width: 700px;
  padding: 20px 40px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  box-shadow: 0 0 3px #52006a;
  border-radius: 7px;

  .nav-tabs {
    width: 100%;
    .nav-item {
      width: 50%;
      div {
        width: fit-content;
        margin: auto;
      }
    }
  }

  @media (max-width: 700px) {
    padding: 20px;
    align-items: center;
    width: 90%;
  }
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 20px;

  @media (max-width: 700px) {
    padding: 5px;
    margin-bottom: 7px;
  }
`;

const Heading = styled.div`
  flex: 1;
  font-weight: 1000;
  font-family: "Fredoka One", cursive;
  text-decoration: underline;
  font-size: 24px;
  color: #52006a;

  @media (max-width: 700px) {
    font-size: 22px;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImgBox = styled.div`
  img {
    width: 200px;
    height: 200px;
    border: 2px solid #0779e4;
    border-radius: 50%;
    margin-bottom: 7px;
  }
  @media (max-width: 700px) {
  }
`;

const SelfInfoBox = styled.div`
  color: #185adb;
  width: 100%;
  font-family: "Pacifico", cursive;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  padding: 10px 40px;
  align-self: flex-end;
  align-items: flex-end;

  @media (max-width: 700px) {
    align-items: center;
    padding: 0px;
  }
`;

const UsernameBox = styled.div`
  font-size: 24px;
  @media (max-width: 700px) {
  }
`;

const EmailBox = styled.div`
  font-size: 24px;

  @media (max-width: 700px) {
  }
`;
