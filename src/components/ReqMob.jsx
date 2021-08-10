import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import axios, { assest } from "../axios";
import { Avatar } from "@material-ui/core";
import { NavLink } from "react-router-dom";

function ReqMob() {
  const [get, setget] = useState({ pending: [], accepted: [] });
  const [did, setdid] = useState({ pending: [], accepted: [] });
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  console.log(get, did);
  useEffect(() => {
    async function fetchData() {
      const allget = await (
        await axios.get("/api/request/allreqget/" + user?._id)
      ).data;
      const alldid = await (
        await axios.get("/api/request/allreqdid/" + user?._id)
      ).data;
      let pending = allget.filter((x) => x.accept === false);
      let accepted = allget.filter((x) => x.accept === true);
      setget({ pending: pending, accepted: accepted });
      pending = alldid.filter((x) => x.accept === false);
      accepted = alldid.filter((x) => x.accept === true);
      setdid({ pending: pending, accepted: accepted });
    }
    fetchData();
  }, [user?._id]);
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12"></div>
        <div className="col-md-6 col-12">
          <Nav>
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
                <div>Request You Get</div>
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
                <div>Request You Did</div>
              </a>
            </div>
          </Nav>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <div>
                <div className="pending">
                  <h3 className="my-4">Pending :-</h3>
                  {get.pending.length ? (
                    get.pending.map((req, i) => (
                      <ReqGet
                        key={i}
                        pending
                        user={user}
                        requesterId={req.requesterId}
                      />
                    ))
                  ) : (
                    <p> No pending request remaining. </p>
                  )}
                </div>
                <div className="accepted">
                  <h3 className="my-4">Accepted :-</h3>
                  {get.accepted.length ? (
                    get.accepted.map((req, i) => (
                      <ReqGet
                        key={i}
                        user={user}
                        requesterId={req.requesterId}
                      />
                    ))
                  ) : (
                    <p> You have not accepted any request yet. </p>
                  )}
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              <div>
                <div className="pending">
                  <h3 className="my-4">Pending :-</h3>
                  {did.pending.length ? (
                    did.pending.map((req, i) => (
                      <ReqDid
                        key={i}
                        pending
                        user={user}
                        accepterId={req.accepterId}
                      />
                    ))
                  ) : (
                    <p> You have no pending request which you created. </p>
                  )}
                </div>
                <div className="accepted">
                  <h3 className="my-4">Accepted :-</h3>
                  {did.accepted.length ? (
                    did.accepted.map((req, i) => (
                      <ReqDid key={i} user={user} accepterId={req.accepterId} />
                    ))
                  ) : (
                    <p> You have no accepted request yet. </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-12"></div>
    </div>
  );
}

const ReqGet = ({ pending, requesterId, user }) => {
  const [requester, setrequester] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const creator = await (
        await axios.get("/api/auth/getUserById/" + requesterId)
      ).data;
      setrequester(creator.send);
    };
    fetchData();
  }, [requesterId]);

  const acceptReq = async () => {
    try {
      let accept = await axios.post("/api/request/acceptReq", {
        requesterId,
        accepterId: user?._id,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        window.alert(accept.res);
        window.location.reload();
      }
    } catch (error) {
      window.alert(error.massage);
    }
  };
  const deleteIt = async () => {
    try {
      let accept = await axios.post("/api/request/deleteReq", {
        requesterId,
        accepterId: user?._id,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        window.alert(accept.res);
        window.location.reload();
      }
    } catch (error) {
      window.alert(error.massage);
    }
  };
  return (
    <>
      <div className="my-2 mx-3 d-flex" style={{ alignItems: "center" }}>
        <Avatar src={assest + requester?.profilePic} />
        <p className="mx-3">
          <NavLink to={"/profile/" + requesterId}>
            <b>{requester?.username}</b>
          </NavLink>{" "}
          {pending ? (
            <> have sent you request for your mobile number. </>
          ) : (
            <>
              have sent you request, and you accepted. <br />
              <a href={`tel:${requester?.mobile}`}>{requester?.mobile}</a> is
              mobile number of user who requested.
            </>
          )}
          {pending ? (
            <div className="mt-2">
              <button className="btn btn-primary" onClick={acceptReq}>
                Accept
              </button>
              <button className="btn btn-primary ml-3" onClick={deleteIt}>
                delete
              </button>
            </div>
          ) : null}
        </p>
      </div>
    </>
  );
};

const ReqDid = ({ pending, accepterId, user }) => {
  const [accepter, setaccepter] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const creator = await (
        await axios.get("/api/auth/getUserById/" + accepterId)
      ).data;
      setaccepter(creator.send);
    };
    fetchData();
  }, [accepterId]);
  const deleteIt = async () => {
    try {
      let accept = await axios.post("/api/request/deleteReq", {
        requesterId: user?._id,
        accepterId,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        window.alert(accept.res);
        window.location.reload();
      }
    } catch (error) {
      window.alert(error.massage);
    }
  };
  return (
    <>
      <div className="my-2 mx-3 d-flex" style={{ alignItems: "center" }}>
        <Avatar src={assest + accepter?.profilePic} />
        <p className="mx-3">
          {pending ? (
            <>
              You have sent you request for mobile number to{" "}
              <NavLink to={"/profile/" + accepterId}>
                <b>{accepter?.username}</b>
              </NavLink>
              .
            </>
          ) : (
            <>
              You have requested{" "}
              <NavLink to={"/profile/" + accepterId}>
                <b>shivaji</b>
              </NavLink>
              , and {accepter?.username + " "}
              accepted. <br />
              <a href={`tel:${accepter?.mobile}`}>{accepter?.mobile}</a> is
              mobile number of {accepter?.username}.
            </>
          )}
          {pending ? (
            <div className="mt-2">
              <button onClick={deleteIt} className="btn btn-primary">
                Remove Request
              </button>
            </div>
          ) : null}
        </p>
      </div>
    </>
  );
};

export default ReqMob;

const Nav = styled.nav`
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
`;
