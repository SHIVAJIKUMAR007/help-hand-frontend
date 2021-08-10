import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../../action";
import { Avatar } from "@material-ui/core";
import io from "socket.io-client";
import axios, { assest, massageSocket } from "../../axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import "./style/chat.css";
import SendIcon from "@material-ui/icons/Send";
import { NavLink, useParams } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { timeToAgo } from "../../someImpFun";

function Chat() {
  const [massages, setMassages] = useState([]);
  const [msgToSend, setmsgToSend] = useState("");
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [secondPerson, setsecondPerson] = useState({});
  const [newMassage, setnewMassage] = useState(0);
  const [room, setroom] = useState({});

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    //get room data
    socket.emit("getRoom", { roomId: id });
    socket.on("getRoomResult", ({ room }) => {
      setroom(room);
    });
    // get all chats
    socket.emit("getAllchats", { roomId: id });
    socket.on("allMassages", ({ massages }) => {
      setMassages(massages);
      //scroll div contain all msg
      document.getElementById("body").scrollTop =
        document.getElementById("body").scrollHeight;
    });
    // making it realtime
    socket.on("newMassage", ({ newMassage }) => {
      setMassages((pre) => {
        return [...pre, newMassage];
      });
      // checking if scroll it or notify for new massage
      const downBtn = document.getElementById("downBtn");
      let { scrollHeight, scrollTop } = document.getElementById("body");
      if (scrollTop < scrollHeight - 600) {
        setnewMassage((pre) => pre + 1);
        downBtn.classList.remove("d-none");
      } else {
        const msgBody = document.getElementById("body");
        msgBody.scrollTop = msgBody.scrollHeight;
        downBtn.classList.add("d-none");
        setnewMassage(0);
      }
    });
    return () => {
      socket.off();
    };
  }, [id]);
  // getting data of second person
  useEffect(() => {
    if (room._id !== undefined) {
      const otherId =
        room?.partners[0] === user?._id ? room?.partners[1] : room?.partners[0];

      const fetchData = async () => {
        const sencond = await (
          await axios.get("/api/auth/getUserById/" + otherId)
        ).data;
        setsecondPerson(sencond.send);
      };
      fetchData();
    }
  }, [user?._id, room?.partners]);

  //send massage
  const sendMassage = (e) => {
    e.preventDefault();
    setmsgToSend("");
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("sendMassage", {
      roomId: id,
      massage: msgToSend,
      senderId: user?._id,
      senderName: user?.name,
      senderPic: user?.profilePic,
    });
  };
  // call onscroll body div
  const scrollIt = () => {
    let { scrollHeight, scrollTop } = document.getElementById("body");
    const downBtn = document.getElementById("downBtn");
    if (scrollTop < scrollHeight - 600) {
      downBtn.classList.remove("d-none");
    } else {
      downBtn.classList.add("d-none");
    }
  };
  // scroll body div till last onclick on down btn
  const scrollTillEnd = () => {
    const msgBody = document.getElementById("body");
    msgBody.scrollTop = msgBody.scrollHeight;
    setnewMassage(0);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="main col-lg-6 col-md-10 col-12 ">
            <h3 className="my-2">
              <span id="backBtn">
                <NavLink to="/chat">
                  <ArrowBackIcon />
                </NavLink>
              </span>
              Chat
            </h3>

            <div className="room">
              <div className="header">
                <NavLink
                  to={"/profile/" + secondPerson?._id}
                  style={{ color: "black" }}
                >
                  <Avatar src={assest + secondPerson?.profilePic} />
                  <div className="secPersonName">{secondPerson?.username}</div>
                </NavLink>
              </div>
              <div className="body" id="body" onScroll={scrollIt}>
                {massages?.map((massage, i) => (
                  <Msg
                    key={i}
                    msg={massage}
                    secondPerson={massage?.doerId !== user?._id}
                  />
                ))}
              </div>
              <div
                className="downBtn d-none"
                id="downBtn"
                onClick={scrollTillEnd}
              >
                down {newMassage}
              </div>
              <div className="sender">
                <form onSubmit={sendMassage}>
                  <input
                    type="text"
                    name="msg"
                    id="msg"
                    value={msgToSend}
                    onChange={(e) => setmsgToSend(e.target.value)}
                    placeholder="Type a massage"
                  />
                  <button className="btn" type="submit">
                    <SendIcon />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
}

function Msg({ secondPerson, msg }) {
  return (
    <>
      <div className={secondPerson ? "secondPerson" : "me"}>
        <div className="msg">{msg.massage}</div>
        <div className="time">{timeToAgo(msg.time)}</div>
      </div>
    </>
  );
}

export default Chat;
