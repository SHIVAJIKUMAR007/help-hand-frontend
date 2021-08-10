import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { isUserSaved, login } from "../action";
import axios, { source } from "../axios";

function Search() {
  const user = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchResults, setsearchResults] = useState([]);
  const { toSearch, city } = useParams();
  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      let d = await axios.post(
        "/api/search/search",
        {
          uid: user?._id,
          city: city ? city : user?.city,
          searchTerm: toSearch,
        },
        { cancelToken: source.token }
      );

      d = await d.data;

      if (d.msg === "banned") {
        dispatch(login(d.user));
        window.alert(d.res);
        history.goBack();
      } else {
        setsearchResults(d.res);
      }
    };
    fetchData();
  }, [user, toSearch, city, history, dispatch]);

  return (
    <>
      <div className="main container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-3 col-12"></div>
          <div className="col-lg-6 col-md-6 col-12">
            {searchResults.length ? (
              searchResults.map((result, i) => (
                <Post key={i} provider help={result} />
              ))
            ) : (
              <h1 className="mt-5 pt-5">
                {" "}
                Noone is providing {toSearch} in {city ? city : user?.city}.{" "}
              </h1>
            )}
          </div>
          <div className="col-lg-3 col-md-3 col-12"></div>
        </div>
      </div>
    </>
  );
}

export default Search;
