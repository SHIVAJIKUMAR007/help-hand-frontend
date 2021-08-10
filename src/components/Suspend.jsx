import React from "react";
import { NavLink } from "react-router-dom";

function Suspend() {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "90%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div>
          <center>
            <h1>Your account is suspended.</h1>
            <p>
              You have break help hand rule multiple time. If you think this is
              a mistake feel free to mail us
            </p>
            <br />
            <NavLink to="/rules">Help Hand Rules</NavLink>
            <br />
            <br />
            <a href="mailto:support@helpHand.com">Mail Us </a>
          </center>
        </div>
      </div>
    </>
  );
}

export default Suspend;
