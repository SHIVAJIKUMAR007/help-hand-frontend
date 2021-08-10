import React, { useEffect, useState } from "react";
import { isUserSaved, login } from "../action";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { useHistory } from "react-router-dom";

function VarifyEmail() {
  const [otp, setotp] = useState(null);
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  console.log("hi from emai   l varify");
  const varifyOtp = async (e) => {
    e.preventDefault();
    try {
      let varify = await axios.post("/api/emailVarify/varifyotp", {
        uid: user?._id,
        otp: otp,
        email: user?.email,
      });
      varify = varify.data;
      if (varify.err) {
        window.alert(varify.res);
      } else {
        dispatch(login(varify.user));
        window.alert(varify.res);
        history.push("/");
      }
    } catch (error) {
      window.alert("some error occured !!!");
    }
  };
  return (
    <div>
      <div
        className="container-fluid"
        style={{ height: "85vh", display: "grid", placeItems: "center" }}
      >
        <div>
          <center>
            <h4>Varify Your Email First</h4>
            <br />
            <p>
              we have sent you a 6-digit otp on your given email address,{" "}
              <b>{user?.email}</b>
            </p>
            <br />
            <form onSubmit={varifyOtp}>
              <input
                type="Number"
                min="100000"
                onChange={(e) => setotp(e.target.value)}
                name="otp"
                value={otp}
                className="form-control w-50"
                required
              />
              <br />
              <button type="submit" className="btn btn-outline-primary">
                Varify OTP
              </button>
            </form>
          </center>
        </div>
      </div>
    </div>
  );
}

export default VarifyEmail;
