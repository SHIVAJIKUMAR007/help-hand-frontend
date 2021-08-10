import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isUserSaved, login } from "../action";
import axios from "../axios";
const Modal = () => {
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
    console.log(image);
    let imgUrl = "";
    if (image.length) {
      const formData = new FormData();
      formData.append("image", image[0]);

      let uploadImage = await axios.post(
        `/api/provide/postImage/${user?._id}`,
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
    let addItem = await axios.post("/api/provide/addProvidingItem", dataToSend);
    addItem = await addItem.data;

    if ((addItem.msg = "ok")) {
      window.alert(addItem.res);
    } else {
      dispatch(login(addItem.user));
      window.alert(addItem.res);
    }
    console.log(dataToSend);

    setassestUrl("");
    setimage([]);
    document.getElementById("reset").click();
    sethelpData({ name: "", desc: "" });
  };
  return (
    <>
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Create Help
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="name">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={helpData.name}
                  onChange={change}
                  className="form-control"
                  required
                />
                <br />

                <label htmlFor="desc">
                  Description <span className="text-danger">*</span>{" "}
                </label>
                <textarea
                  type="text"
                  name="desc"
                  id="desc"
                  value={helpData.desc}
                  onChange={change}
                  className="form-control"
                  required
                />
                <br />
                <label htmlFor="image">Image </label>
                <input
                  onChange={(e) => {
                    setimage(e.target.files);
                    showAssest(e.target.files[0]);
                  }}
                  type="file"
                  name="image"
                  id="image"
                  multiple={0}
                  accept="image/*"
                />
              </div>
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={submit}
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Submit Help
                </button>
                <button
                  type="reset"
                  id="reset"
                  style={{ display: "none" }}
                ></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
