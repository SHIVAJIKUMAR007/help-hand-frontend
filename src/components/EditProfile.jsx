import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { CameraAlt } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved, login } from "../action";
import axios, { assest } from "../axios";
function EditProfile() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  return <Helper user={user} />;
}
function Helper({ user }) {
  const [isUsernameUnique, setisUsernameUnique] = useState(2);
  const [isEmailUnique, setisEmailUnique] = useState(2);
  const [info, setinfo] = useState({});
  const [pic, setpic] = useState([]);
  const [picUrl, setpicUrl] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    setinfo({
      uid: user?._id,
      username: user?.username,
      email: user?.email,
      bio: user?.bio,
      city: user?.city,
      state: user?.state,
      pincode: user?.pincode,
      country: user?.country,
    });
  }, [user]);
  const change = (e) => {
    const { name, value } = e.target;
    setinfo((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const checkUsername = async (e) => {
    change(e);
    setisUsernameUnique(1);
    if (e.target.value === user?.username) {
      setisUsernameUnique(2);
      return;
    }
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
    if (e.target.value === user?.email) {
      setisEmailUnique(2);
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

    if (isEmailUnique !== 2 || isUsernameUnique !== 2) {
      window.alert(
        "Username or email is already registered. Please Choose unique username and email."
      );
      return;
    }

    let update = await axios.post("/api/auth/updateRestData", info);
    update = await update.data;
    if (update.msg === "ok") {
      window.alert("Your data is updated!!!");
      dispatch(login({ ...user, ...info }));
    } else {
      window.alert("Server is temprerory down!!!!");
    }
  };
  const chanageProfilePic = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("profilePic", pic[0]);
    let uploadPic = await axios.post(
      "/api/auth/updateProfilePic/" + user?._id,
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    uploadPic = await uploadPic.data;

    if (uploadPic.msg === "ok") {
      window.alert("Profile Picture is updated.");
      dispatch(login({ ...user, profilePic: uploadPic.profilePic }));
    } else {
      window.alert(uploadPic.msg);
    }
  };
  return (
    <Box className="container">
      <ProfileBodyBox className="row">
        <LeftBox className="col-md-3 col-12">
          <form className="profilePicForm mx-auto" onSubmit={chanageProfilePic}>
            <div
              style={{ position: "relative", width: "10rem", height: "10rem" }}
            >
              <Avatar
                src={picUrl ? picUrl : `${assest}${user?.profilePic}`}
                id="avatar"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />
              <label
                htmlFor="profilePic"
                style={{ position: "absolute", bottom: "0", right: "40%" }}
              >
                <br /> <CameraAlt />
              </label>
              <input
                type="file"
                name="profilePic"
                id="profilePic"
                className="d-none"
                onChange={(e) => {
                  setpic(e.target.files);
                  setpicUrl(URL.createObjectURL(e.target.files[0]));
                }}
                accept="image/*"
                multiple={0}
              />
            </div>
            <center>
              <button type="submit" className="btn btn-outline-success my-4">
                Update Profile Pic
              </button>
            </center>
          </form>
        </LeftBox>

        <RightBox className="col-md-9 col-12">
          <PersonalInfoBox>
            <h1>Personal Info</h1>

            <Form onSubmit={submit}>
              <div className="mx-2 d-flex">
                <input
                  className="form-control mr-2"
                  name="username"
                  type="text"
                  onChange={checkUsername}
                  value={info?.username}
                  placeholder="Username"
                />
                <Loder val={isUsernameUnique} />
              </div>
              <div className="mx-2 d-flex">
                <input
                  className="form-control mr-2"
                  name="email"
                  type="email"
                  onChange={checkEmail}
                  value={info?.email}
                  placeholder="Email"
                />
                <Loder val={isEmailUnique} />
              </div>
              <div className="mx-2 my-3">
                <textarea
                  className="form-control"
                  type="text"
                  name="bio"
                  value={info?.bio}
                  onChange={change}
                  placeholder="Bio"
                />
              </div>
              <div className="mx-2">
                <input
                  className="form-control"
                  onChange={change}
                  name="city"
                  type="text"
                  value={info?.city}
                  placeholder="City"
                />
              </div>
              <div className="mx-2">
                <input
                  className="form-control"
                  name="state"
                  onChange={change}
                  value={info?.state}
                  type="text"
                  placeholder="State"
                />
              </div>
              <div className="mx-2">
                <input
                  className="form-control"
                  name="country"
                  value={info?.country}
                  onChange={change}
                  type="text"
                  placeholder="Country"
                />
              </div>
              <div className="mx-2">
                <input
                  className="form-control"
                  name="pincode"
                  value={info?.pincode}
                  onChange={change}
                  type="text"
                  placeholder="PinCode"
                />
              </div>
              <br />
              <br />
              <button className="mx-2 mt-3 btn btn-primary" type="submit">
                save
              </button>
            </Form>
          </PersonalInfoBox>
          <ResetPass user={user} />
        </RightBox>
      </ProfileBodyBox>
    </Box>
  );
}

function ResetPass({ user }) {
  const [pass, setpass] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setpass((pre) => {
      return { ...pre, [name]: value };
    });
    console.log(pass);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (pass.newPassword !== pass.confirmPassword) {
      window.alert("new password must be same as confirm password");
    } else if (pass.currentPassword === pass.newPassword) {
      window.alert("new password is same to the current password");
    } else {
      let updatePass = await axios.post("/api/auth/updatePassword", {
        ...pass,
        uid: user?._id,
      });
      updatePass = updatePass.data;
      if (updatePass.msg === "ok")
        window.alert("Your password is updated successfully");
      setpass({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h4 className="my-4 ">Reset Password</h4>
      <label htmlFor="currentPassword">Current Password :</label>
      <input
        type="password"
        name="currentPassword"
        id="currentPassword"
        className="form-control"
        minLength="6"
        onChange={handleChange}
        required
      />
      <br />
      <label htmlFor="newPassword">New Password :</label>
      <input
        type="password"
        name="newPassword"
        id="newPassword"
        className="form-control"
        minLength="6"
        onChange={handleChange}
        required
      />
      <br />
      <label htmlFor="confirmPassword">Confirm Password :</label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        className="form-control"
        minLength="6"
        onChange={handleChange}
        required
      />
      <br />
      <button type="submit" className="btn btn-outline-success w-100 mb-5">
        Reset Password
      </button>
    </form>
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
export default EditProfile;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
`;

const ProfileBodyBox = styled.div`
  display: flex;
  background: white;
  width: inherit;
  height: inherit;
  margin-top: 10px;
`;

const LeftBox = styled.div`
  background: none;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px 10px;
  border-radius: 7px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const RightBox = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
`;

const PersonalInfoBox = styled.div`
  display: flex;
  flex: 0.6;
  flex-direction: column;
  padding-top: 20px;

  h1 {
    padding: 20px;
    padding-left: 0;
    font-size: 1.3rem;
    font-family: "Pacifico", cursive;
    text-decoration: underline;
    align-self: flex-start;
    color: #0779e4;
  }

  Form {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  Button {
    width: 100px;
  }
`;
