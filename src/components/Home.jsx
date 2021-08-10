import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved } from "../action";
import AskHelp from "./AskHelp";
import axios from "../axios";
import { NavLink } from "react-router-dom";

function Home() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [findHelp, setfindHelp] = useState([]);
  const [provideHelp, setprovideHelp] = useState([]);
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id === undefined) return;

      let find = await axios.post("/api/reccomand/helpInLocal", {
        pincode: user?.pincode,
        city: user?.city,
        state: user?.state,
        uid: user?._id,
      });
      find = await find.data;
      setfindHelp(find);
      let provide = await axios.post("/api/reccomand/giveHelpInLocal", {
        pincode: user?.pincode,
        city: user?.city,
        state: user?.state,
        uid: user?._id,
      });
      provide = await provide.data;
      setprovideHelp(provide);
    };
    fetchData();
  }, [user?._id, user?.city, user?.state, user?.pincode]);

  return (
    <>
      {user ? (
        <Container>
          <CreatePostBox>
            <AskHelp />
          </CreatePostBox>

          <PostsContainer>
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
                  <div>Find</div>
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
                  <div>Provide</div>
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
                {findHelp.length ? (
                  findHelp.map((help, i) => (
                    <Post key={i} provider help={help} />
                  ))
                ) : (
                  <h1 className="mt-5 pt-5 mx-5">
                    No Help Present in your Locality
                  </h1>
                )}
              </div>
              <div
                className="tab-pane fade"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                {provideHelp.length ? (
                  provideHelp.map((help, i) => <Post key={i} help={help} />)
                ) : (
                  <h1 className="mt-5 pt-5 mx-5">
                    No one want help in your Locality
                  </h1>
                )}
              </div>
            </div>
            {/* <Post /> */}
          </PostsContainer>
        </Container>
      ) : (
        <UnsignedHome />
      )}
    </>
  );
}

const UnsignedHome = () => {
  return (
    <>
      <div className="container">
        <div className=" row mt-5">
          <div
            className="col-12 col-md-6 col-lg-6 order-lg-1 order-md-1 order-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <h1>Many are here</h1>
              <h1>Were are You</h1>

              <div>
                <p>
                  Need help, here are many people who are ready
                  <br />
                  to help you, just find a right person and
                  <br /> start chatting with him.
                  <br />
                  <br />
                  You want to contribute to society,
                  <br />
                  help others people nearby you,
                  <br /> who really need your help.
                </p>
              </div>
              <div className="d-flex" style={{ flexWrap: "wrap" }}>
                <NavLink
                  to="/register"
                  className="btn  mt-4 btn-outline-primary"
                >
                  Register Now
                </NavLink>
                <NavLink
                  to="/login"
                  className="btn  mt-4 ml-5 btn-outline-primary"
                >
                  Login
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6  order-lg-2 order-md-2 order-1">
            <img
              src="/images/helping-hands.png"
              alt="help hand"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

const Container = styled.div`
  margin: 0 10%;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
`;

const PostsContainer = styled.div`
  flex: 1;
  height: 70vh;
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

const CreatePostBox = styled.div`
  display: flex;
  flex: 0.4;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0 0 4px black;
  height: fit-content;
  margin-right: 10px;
  margin-left: 4%;
  border-radius: 7px;
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
  h1 {
    padding: 20px 0px;
    font-family: "Pacifico", cursive;
    color: #0779e4;
    text-decoration: underline;
  }

  input {
    display: flex;
    flex: 1;
    padding: 7px 10px;
    border-radius: 7px;
    outline: none;
    border: 2px solid black;

    :focus::placeholder {
      color: transparent;
    }
  }
`;
