import axios from "../axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Post from "./Post";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved } from "../action";
function OnePost() {
  const { id } = useParams();
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [post, setpost] = useState({});
  const [provider, setprovider] = useState(false);
  useEffect(() => {
    dispatch(isUserSaved());
    const fetchData = async () => {
      const data = await (await axios.get("/api/search/post/" + id)).data;
      setpost(data.post);
      setprovider(data.provider);
    };
    fetchData();
  }, [id, dispatch]);
  return (
    <div className="container mt-5">
      <Post help={post} provider={provider} />
      {user ? null : (
        <div
          className="d-flex w-50 mx-auto"
          style={{ flexWrap: "wrap", justifyContent: "space-evenly" }}
        >
          <NavLink to="/register" className="btn  mt-4 btn-outline-primary">
            Register Now
          </NavLink>
          <NavLink to="/login" className="btn  mt-4 ml-5 btn-outline-primary">
            Login
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default OnePost;
