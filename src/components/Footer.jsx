import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  const d = new Date();
  return (
    <div className="bg-primary text-white w-100">
      <div className="container">
        <div className="row">
          <h5 className="text-center my-2">
            © Help Hand {d.getFullYear()} All Rights Reserved.
          </h5>
          <div className="d-flex ml-auto" style={{ alignItems: "center" }}>
            <NavLink
              to="/about"
              style={{ color: "white", marginRight: "10px" }}
            >
              About Us{" "}
            </NavLink>

            <NavLink
              to="/terms"
              style={{ color: "white", marginRight: "10px" }}
            >
              Terms and conditions{" "}
            </NavLink>
            <NavLink
              to="/privacy-policy"
              style={{ color: "white", marginRight: "10px" }}
            >
              Privacy policy{" "}
            </NavLink>
            <NavLink
              to="/contact"
              style={{ color: "white", marginRight: "10px" }}
            >
              Contact Us{" "}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
