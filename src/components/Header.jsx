import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import HomeTwoToneIcon from "@material-ui/icons/HomeTwoTone";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import PostAddTwoToneIcon from "@material-ui/icons/PostAddTwoTone";
import PersonTwoToneIcon from "@material-ui/icons/PersonTwoTone";
import MobileFriendlyIcon from "@material-ui/icons/MobileFriendly";
import ChatIcon from "@material-ui/icons/Chat";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved, logout } from "../action";
import { NavLink, useHistory } from "react-router-dom";
import Modal from "./Modal";
import MenuIcon from "@material-ui/icons/Menu";

function Header() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [toSearch, settoSearch] = useState("");
  const [city, setcity] = useState("");
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  const logoutFun = () => {
    const ask = window.confirm("Do you really want to logout?");
    if (ask) {
      dispatch(logout());
      window.location.replace("/");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (toSearch === "") {
      window.alert("please enter item name before search.");
      return;
    }
    if (city === "") {
      setcity(user?.city);
    }
    history.push(`/search/${toSearch}/${city}`);
  };
  const invismenu = () => {
    document.getElementById("ul").classList.add("invis");
    document.getElementById("ul").classList.remove("vis");
  };
  return (
    <>
      <Container>
        <NavLink to="/">
          <LogoBox>
            <P>H</P>
            <BrandName>
              <h1>Help</h1>
              <h1>Hand</h1>
            </BrandName>
          </LogoBox>
        </NavLink>

        {user && user?.active !== false && user?.emailVarify !== false ? (
          <SearchBoxContainer>
            <Form onSubmit={submit}>
              <SearchBox
                type="text"
                placeholder="Find item"
                value={toSearch}
                onChange={(e) => {
                  settoSearch(e.target.value);
                }}
                required
              />
              <SearchBox
                type="text"
                placeholder="city"
                value={city}
                onChange={(e) => {
                  setcity(e.target.value);
                }}
              />
            </Form>
            <SearchIconContainer style={{ cursor: "pointer" }} onClick={submit}>
              <SearchOutlinedIcon />
            </SearchIconContainer>
          </SearchBoxContainer>
        ) : null}
        <NavigationMenuBox>
          <ul id="ul" className="invis">
            {user ? (
              <>
                <li onClick={invismenu}>
                  <NavLink to="/">
                    <span>
                      <HomeTwoToneIcon />
                    </span>
                    <span>Home</span>
                  </NavLink>
                </li>
                {user?.active !== false && user?.emailVarify !== false ? (
                  <>
                    {" "}
                    <li onClick={invismenu}>
                      <NavLink
                        to="#"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                      >
                        <span>
                          <PostAddTwoToneIcon />
                        </span>
                        <span>Create Help</span>
                      </NavLink>
                    </li>
                    <li onClick={invismenu}>
                      <NavLink to="/chat">
                        <span>
                          <ChatIcon />
                        </span>
                        <span>Chat</span>
                      </NavLink>
                    </li>
                    <li onClick={invismenu}>
                      <NavLink to="/request">
                        <span>
                          <MobileFriendlyIcon />
                        </span>
                        <span>Requests</span>
                      </NavLink>
                    </li>
                    <li onClick={invismenu}>
                      <NavLink to="/profile/own">
                        <span>
                          <PersonTwoToneIcon />
                        </span>
                        <span>Account Info</span>
                      </NavLink>
                    </li>
                  </>
                ) : null}
                <li onClick={invismenu}>
                  <NavLink to="#" onClick={logoutFun}>
                    <span>
                      <ExitToAppTwoToneIcon />
                    </span>
                    <span>Log out</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li onClick={invismenu}>
                  <NavLink to="/">
                    <span>
                      <HomeTwoToneIcon />
                    </span>
                    <span>Home</span>
                  </NavLink>
                </li>
                <li onClick={invismenu}>
                  <NavLink to="/login">
                    <span>
                      <PostAddTwoToneIcon />
                    </span>
                    <span>Login</span>
                  </NavLink>
                </li>
                <li onClick={invismenu}>
                  <NavLink to="/register">
                    <span>
                      <PersonTwoToneIcon />
                    </span>
                    <span>Register</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </NavigationMenuBox>

        <BurgerMenuBox
          onClick={() => {
            const ul = document.getElementById("ul");
            let state = ul.classList[0];
            if (state === "invis") {
              ul.classList.add("vis");
              ul.classList.remove("invis");
            } else {
              ul.classList.add("invis");
              ul.classList.remove("vis");
            }
          }}
        >
          <MenuIcon />
        </BurgerMenuBox>
      </Container>

      <Modal />
    </>
  );
}

export default Header;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  outline: none;
  height: 50px;
  width: 100%;
  z-index: 10;
  padding: 30px 6%;
  box-shadow: 0 1px 2px black;
  position: sticky;
  background-color: #fff;
  top: 0;

  @media (max-width: 1020px) {
    padding: 25px 40px;
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
  }

  @media (max-width: 500px) {
    padding: 10px 15px;
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  font-family: "Ultra", serif;
`;

const BrandName = styled.div`
  align-self: flex-end;
  justify-content: center;
  margin: 0px;
  margin-left: 4px;
  color: #0779e4;

  h1 {
    font-size: 16px;
    margin-bottom: 0px;

    @media (max-width: 700px) {
      display: none;
    }
  }
`;

const P = styled.p`
  color: white;
  font-size: 1.5rem;
  padding: 4px 10px;
  background: #0779e4;
  border-radius: 5px;
  text-shadow: 1px 1px #2940d3, 0px 2px white;
  display: flex;
  margin-bottom: 0;
`;

const NavigationMenuBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s;
  @media (max-width: 768px) {
    position: absolute;
    top: 50px;
    width: 100vw;
    text-align: center;
    background-color: white;
    left: 0;
    box-shadow: 0 1px 2px black;
    li {
      margin: 5px 0;
    }
    .invis {
      display: none;
    }
    .vis {
      display: block;
      transition: 1s ease;
    }
  }
  ul {
    list-style: none;
    display: flex;
    margin-bottom: 0;
  }

  ul li {
    display: flex;
    height: 100%;
    margin-right: 16px;
    justify-content: center;
    align-items: center;
    font-size: 13px;

    span {
      vertical-align: middle;
      display: inline-block;
      font-weight: 700;
    }

    span svg {
      color: #0779e4;
    }
  }
`;

const SearchBoxContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 42px;
  flex: 1;
  margin: 0 2rem;

  @media (max-width: 500px) {
    margin: 0 5px;
  }
`;
const Form = styled.form`
  width: 100%;

  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
`;
const SearchBox = styled.input`
  height: 38px;
  width: 100%;
  border-right: none;
  outline: none;
  border: 2px solid #0779e4;
  border-right: none;
  padding-left: 14px;
  font-size: 14px;

  ::placeholder {
    color: #9ab3f5;
  }

  :focus {
    outline: none;
  }
`;

const SearchIconContainer = styled.div`
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  background-color: #0779e4;
  color: white;
`;

const BurgerMenuBox = styled.div`
  display: none;
  width: 30px;
  height: 30px;
  color: #0779e4;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(1.3);
  }
`;
