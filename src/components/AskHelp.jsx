import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved, login } from "../action";
import axios from "../axios";

function AskHelp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer);
  const [helpData, sethelpData] = useState({
    name: "",
    desc: "",
  });
  const [image, setimage] = useState([]);
  const [assestUrl, setassestUrl] = useState("");

  useEffect(() => {
    dispatch(isUserSaved());
  }, [dispatch]);
  const change = (e) => {
    const { name, value } = e.target;

    sethelpData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const showAssest = (file) => {
    if (file) {
      setassestUrl(URL.createObjectURL(file));
    } else {
      setassestUrl("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (image.length) {
      const formData = new FormData();
      formData.append("image", image[0]);

      let uploadImage = await axios.post(
        `/api/request/postImage/${user?._id}`,
        formData
      );
      uploadImage = await uploadImage.data;

      if (uploadImage.msg !== "ok") {
        window.alert(
          "Server is temprary Down, Please come again after some time!!!"
        );
        return;
      } else imgUrl = uploadImage.imageUrl;
    }

    const dataToSend = {
      name: helpData.name,
      desc: helpData.desc,
      image: imgUrl,
      ...user,
    };
    let addItem = await axios.post("/api/request/addRequestedItem", dataToSend);
    addItem = await addItem.data;

    if ((addItem.msg = "ok")) {
      window.alert(addItem.res);
    } else {
      dispatch(login(addItem.user));
      window.alert(addItem.res);
    }

    setassestUrl("");
    setimage([]);
    document.getElementById("reset").click();
    sethelpData({ name: "", desc: "" });
  };
  return (
    <>
      <h1>Ask For Help</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          name="name"
          placeholder="Name of Commodity"
          className="form-control"
          value={helpData.name}
          onChange={change}
          required
        />
        <br />
        <input
          type="text"
          name="desc"
          placeholder="add desc."
          className="form-control"
          value={helpData.desc}
          onChange={change}
          required
        />
        <br />
        <label>Attach Some Proof</label>
        <input
          type="file"
          name="proof"
          placeholder="Attach some proof"
          id="image"
          accept="image/*"
          onChange={(e) => {
            setimage(e.target.files);
            showAssest(e.target.files[0]);
          }}
          className="form-control"
        />
        <br />
        <div className="previewAssest">
          {assestUrl ? (
            <img
              src={assestUrl}
              alt="assestPreview"
              style={{ width: "100%" }}
            />
          ) : null}
        </div>
        <br />
        <button type="submit" className="btn btn-outline-primary w-100">
          <b>Submit My Request</b>
        </button>
        <button type="reset" id="reset" style={{ display: "none" }}></button>
      </form>
    </>
  );
}

export default AskHelp;
