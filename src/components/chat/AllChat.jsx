import React, { useEffect, useLayoutEffect, useState } from "react";
import "./style/chatAll.css";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../../action";
import { Avatar } from "@material-ui/core";
import io from "socket.io-client";
import axios, { massageSocket, assest } from "../../axios";
import { timeToAgo } from "../../someImpFun";
import { NavLink } from "react-router-dom";

function AllChat() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [rooms, setrooms] = useState([]);

  useLayoutEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("getRooms", { uid: user?._id });
    socket.on("getAllRooms", ({ rooms }) => {
      setrooms(rooms);
    });
    //updating new room created in real time
    socket.on("newRoomAdded", ({ newRoom }) => {
      setrooms((pre) => {
        pre = [newRoom, ...pre];
      });
    });

    return () => {
      socket.off();
    };
  }, [user]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-1 col-12"></div>

          {/* main work is here  */}
          <div className="main col-lg-6 col-md-10 col-12 ">
            <h3 className="my-2">Chat</h3>

            <div className="allRooms">
              {rooms.length ? (
                rooms?.map((room, i) => (
                  <OneRoom
                    key={i}
                    user={user}
                    room1={room}
                    setRooms={setrooms}
                  />
                ))
              ) : (
                <h1 className="mt-5 pt-5 mx-auto"> You have no chat room. </h1>
              )}
            </div>
          </div>

          <div className="col-lg-3 col-md-1 col-12"></div>
        </div>
      </div>
    </>
  );
}

const OneRoom = ({ user, room1, setRooms }) => {
  const [room, setroom] = useState(room1);
  const [newMassage, setnewMassage] = useState(0);
  const [secondPerson, setsecondPerson] = useState({});
  useEffect(() => {
    if (room._id !== undefined) {
      const otherId =
        room1?.partners[0] === user?._id
          ? room1?.partners[1]
          : room1?.partners[0];
      const fetchData = async () => {
        const sencond = await (
          await axios.get("/api/auth/getUserById/" + otherId)
        ).data;
        setsecondPerson(sencond.send);
      };
      fetchData();
    }
  }, [user, room?._id]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("joinChatRoom", { roomId: room?._id });
    // updating lastmassage in realtime
    socket.on("lastMassageUpdated", ({ lastMassage, lastMassageTime }) => {
      setroom((pre) => {
        return {
          ...pre,
          lastMassage,
          lastMassageTime,
        };
      });
      setnewMassage((pre) => pre + 1);
      setRooms((pre) => {
        const res = pre.find((x) => x._id === room._id);
        res.lastMassage = lastMassage;
        res.lastMassageTime = lastMassageTime;
        pre.sort((a, b) => {
          return Date.parse(b.lastMassgeTime) - Date.parse(a.lastMassgeTime);
        });
        return pre;
      });
    });
    return () => {
      socket.off();
    };
  }, [room, setRooms]);
  return (
    <>
      <NavLink to={`/chat/${room?._id}`}>
        <div className="oneRoom">
          <Avatar src={assest + secondPerson?.profilePic} />
          <div className="roomDetails">
            <h6>{secondPerson?.username}</h6>
            <p>{room?.lastMassage ? room?.lastMassage : null}</p>
            <p>{room?.lastMassage ? timeToAgo(room?.lastMassageTime) : null}</p>
          </div>
          {newMassage ? (
            <div
              className="ml-auto p-2 bg-primary text-white"
              style={{ borderRadius: "50%" }}
            >
              {newMassage}
            </div>
          ) : null}
        </div>
      </NavLink>
    </>
  );
};

export default AllChat;
