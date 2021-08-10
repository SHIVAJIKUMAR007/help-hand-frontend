import React, { useState } from "react";
import styled from "styled-components";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { login } from "../action";
import { NavLink, useHistory } from "react-router-dom";

function Signin() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loginData, setloginData] = useState({
    identifier: "",
    password: "",
  });

  const change = (e) => {
    let { name, value } = e.target;

    setloginData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    let loginRes = await axios.post("/api/auth/login", loginData);
    loginRes = await loginRes.data;

    if (loginRes.err) {
      window.alert(loginRes.msg);
    } else {
      dispatch(login(loginRes.user));
      window.alert(loginRes.msg);
      history.push("/");
    }
  };

  return (
    <Container>
      <InfoContainer>
        <img src="/images/bgimg.jpg" alt="help hend login" />
      </InfoContainer>
      <FormContainer>
        <h1>Sign In</h1>
        <Desc>
          <p>Welcome back to the Help Hand society.</p>
        </Desc>
        <Form onSubmit={submit}>
          <Input
            type="text"
            name="identifier"
            placeholder="Username or Email"
            onChange={change}
          />
          <Input
            type="password"
            minLength={6}
            name="password"
            placeholder="Password"
            onChange={change}
          />

          <SubmitBtn type="submit">Log in</SubmitBtn>
        </Form>
        <p>
          Not yet signed up? Join the society by{" "}
          <NavLink to="/register">Register</NavLink>ing.
        </p>
      </FormContainer>
    </Container>
  );
}

export default Signin;

const Container = styled.div`
  height: 100vh;
  display: flex;
  width: 100%;

  @media (max-width: 1020px) {
    flex-direction: column;
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 350px;
  padding: 40px 50px;
  flex: 1;
  color: #0a043c;

  h1 {
    font-size: 36px;
    margin-top: 0px;
    font-family: "Pacifico", cursive;
  }

  p {
    margin-top: 20px;
    font-family: sans-serif;
    color: grey;
    text-align: center;

    @media (max-width: 1020px) {
      margin-top: 0px;
    }
  }

  a {
    font-family: cursive;
    font-weight: 600;
    text-decoration: underline;

    @media (max-width: 1020px) {
    }
  }

  @media (max-width: 1020px) {
    width: 70%;
    padding: 20px;
    margin: 0 30px;
    align-self: center;
  }

  @media (max-width: 500px) {
    width: 100%;
    padding: 10px;
  }

  @media (max-width: 1020px) {
    width: 70%;
    padding: 20px;
    margin: 0 30px;
    align-self: center;
  }

  @media (max-width: 500px) {
    width: 100%;
    padding: 10px;
  }
`;

const Desc = styled.div`
  margin-top: 10px;

  @media (max-width: 1020px) {
  }

  @media (max-width: 1020px) {
  }

  p {
    font-family: sans-serif;
    color: grey;
    text-align: start;

    @media (max-width: 1020px) {
      margin-left: 10px;
    }
  }
`;

const Form = styled.form`
  display: grid;
  place-items: center;
  grid-template-columns: auto;
  grid-row-gap: 30px;
  grid-column-gap: 40px;
  column-span: all;
  margin-top: 50px;

  @media (max-width: 1020px) {
    box-shadow: 0 0 3px #0a043c;
    border-radius: 7px;
    padding: 10px 30px;
    margin: 10px;
  }
`;

const Input = styled.input`
  padding: 10px 20px;
  width: 100%;
  outline: none;
  border: none;
  font-family: "Fredoka One", cursive;
  border-radius: 10px;
  box-shadow: 0 0 3px #0a043c;

  @media (max-width: 1020px) {
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid #0a043c;
  }

  :focus::placeholder {
    color: transparent;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  margin-top: 50px;
  padding: 7px 25px;
  background: white;
  font-size: 18px;
  background: #fe346e;
  color: white;
  border: none;
  outline: none;
  border-radius: 10px;
  justify-self: flex-start;

  @media (max-width: 1020px) {
    margin-top: 10px;
    max-width: 200px;
    justify-self: center;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  img {
    height: 100vh;
    width: 600px;

    @media (max-width: 1200px) {
      width: 100%;
      height: 500px;
      margin-bottom: 20px;
    }
  }
  @media (max-width: 1200px) {
    width: 100%;
  }
`;
