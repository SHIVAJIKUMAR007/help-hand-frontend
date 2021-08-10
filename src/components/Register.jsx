import React, { useState } from "react";
import styled from "styled-components";
import axios from "../axios";
import { login } from "../action";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [signupData, setsignupData] = useState({
    username: "",
    email: "",
    mobile: null,
    city: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
    cpassword: "",
  });
  const [isUsernameUnique, setisUsernameUnique] = useState(0);
  const [isEmailUnique, setisEmailUnique] = useState(0);

  const change = (e) => {
    const { name, value } = e.target;
    setsignupData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const checkUsername = async (e) => {
    change(e);
    setisUsernameUnique(1);
    let check = await (
      await axios.get(
        `/api/auth/usernameExists/${
          e.target.value ? e.target.value : "shivaji"
        }`
      )
    ).data;
    if (check.err) setisUsernameUnique(-1);
    else setisUsernameUnique(2);
  };
  const checkEmail = async (e) => {
    change(e);
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setisEmailUnique(1);
    if (!e.target.value.match(validRegex)) {
      setisEmailUnique(3);
      return;
    }
    let check = await (
      await axios.get(
        `/api/auth/emailExists/${
          e.target.value ? e.target.value : "shivaji@gmail.com"
        }`
      )
    ).data;
    if (check.err) setisEmailUnique(-1);
    else setisEmailUnique(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.cpassword) {
      window.alert("Confirm password must be same as password...");
      return;
    }
    if (isEmailUnique !== 2 || isUsernameUnique !== 2) {
      window.alert(
        "Username or email is already registered. Please Choose unique username and email."
      );
      return;
    }

    let signupRes = await axios.post("/api/auth/signup", signupData);
    signupRes = await signupRes.data;
    if (signupRes.msg === "ok") {
      window.alert("Welcome to Help Hand. You are registered on our platform.");
      dispatch(login(signupRes.data));
      history.push("/");
    } else {
      window.alert("Server is temprerory down!!!!");
    }
  };
  return (
    <FormContainer>
      <h1>Register</h1>
      <p>
        Choose your way to give back to society.
        <br />
        Join the community and play your part in keeping alive the Humanity.
      </p>
      <Form onSubmit={submit}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          onChange={checkUsername}
        />
        <Loder val={isUsernameUnique} />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          onChange={checkEmail}
        />
        <Input
          type="number"
          name="mobile"
          placeholder="Mobile No."
          onChange={change}
          minLength="10"
          required
        />
        <Loder val={isEmailUnique} />
        <Input type="text" name="city" placeholder="City" onChange={change} />
        <Input type="text" name="state" placeholder="State" onChange={change} />
        <Input
          type="text"
          name="country"
          placeholder="Country"
          onChange={change}
        />
        <Input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={change}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          minLength={6}
          onChange={change}
        />
        <Input
          type="password"
          name="cpassword"
          placeholder="Confirm Password"
          minLength={6}
          onChange={change}
        />
        <div className="d-flex">
          <input
            type="checkbox"
            name="check"
            id="check"
            className="mt-2 mr-3"
            required
          />
          <label htmlFor="check">
            Please Read our <NavLink to="/terms">term and conditions</NavLink>,
            and check this checkbox if you agree.
          </label>
        </div>
        <SubmitBtn type="submit">Sign Up</SubmitBtn>
      </Form>
      <p>
        Already have an Account? <NavLink to="/login">Sign in</NavLink>
      </p>
    </FormContainer>
  );
}

const Loder = ({ val }) => {
  return (
    <>
      {val === 0 ? null : val === 1 ? (
        <p style={{ color: "yellow" }}>loding...</p>
      ) : val === 2 ? (
        <p style={{ color: "green" }}>valid!!!</p>
      ) : val === 3 ? (
        <>
          <p style={{ color: "orange" }}>Not a Email</p>
        </>
      ) : (
        <p style={{ color: "red" }}>Already Exist...</p>
      )}
    </>
  );
};

export default Register;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 50px 50px 30px 20px;
  flex: 3;
  color: #0a043c;

  h1 {
    font-size: 36px;
    margin-top: 0px;
    margin-left: 50px;
    font-family: "Pacifico", cursive;

    @media (max-width: 1200px) {
      margin-left: 0;
      align-items: center;
      width: 300px;
      width: 100%;
    }
  }

  p {
    margin-left: 50px;
    padding: 10px 0;
    margin-bottom: 50px;
    font-family: sans-serif;
    color: grey;
    line-height: 20px;

    @media (max-width: 1200px) {
      align-self: center;
      flex: 1;
    }

    @media (max-width: 768px) {
      margin-left: 0;
      padding: 10px;
    }
  }

  a {
    font-family: cursive;
    font-weight: 600;
    text-decoration: underline;
  }

  @media (max-width: 1200px) {
    flex: 1;
    width: auto;
    padding: 10px;
    text-align: center;
  }
`;

const Form = styled.form`
  display: grid;
  place-items: center;
  grid-template-columns: auto auto;
  grid-row-gap: 30px;
  grid-column-gap: 40px;
  column-span: all;
  margin: 0 50px;

  @media (max-width: 768px) {
    grid-template-columns: auto;
    grid-row-gap: 10px;
    grid-column-gap: 0px;
    margin: 0 10px;
    box-shadow: 0 0 3px #0a043c;
    padding: 10px 0;
    border-radius: 7px;
    padding: 10px 30px;
  }
`;

const Input = styled.input`
  padding: 10px 20px;
  width: 100%;
  outline: none;
  border: none;
  font-family: "Fredoka One", cursive;
  box-shadow: 0 0 3px #0a043c;
  border-radius: 10px;

  :focus::placeholder {
    color: transparent;
  }

  @media (max-width: 768px) {
    padding: 7px 10px;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid #0a043c;
    font-family: cursive;
    font-size: 12px;
  }
`;

const SubmitBtn = styled.button`
  width: 180px;
  margin-top: 30px;
  padding: 7px 25px;
  background: white;
  font-size: 18px;
  background: #fe346e;
  color: white;
  border: none;
  outline: none;
  border-radius: 8px;
  justify-self: flex-start;

  @media (max-width: 768px) {
    justify-self: center;
    margin-top: 20px;
    padding: 7px 15px;
    margin-left: 20px;
    margin-right: 20px;
  }
`;
