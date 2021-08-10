export const authReducer = (state = null, action) => {
  switch (action.type) {
    case "IS_USER_SAVED":
      const data = window.localStorage.getItem("@Z(helpHand)^&*/user/@!");
      return (state = JSON.parse(data));
    case "LOGIN":
      window.localStorage.setItem(
        "@Z(helpHand)^&*/user/@!",
        JSON.stringify(action.payload)
      );
      return (state = action.payload);

    case "LOGOUT":
      window.localStorage.removeItem("@Z(helpHand)^&*/user/@!");
      return (state = null);

    case "PROFILE_PIC_UPDATE":
      let userData = window.localStorage.getItem("@Z(helpHand)^&*/user/@!");
      userData = JSON.parse(userData);
      userData.profilePic = action.payload;
      window.localStorage.setItem(
        "@Z(helpHand)^&*/user/@!",
        JSON.stringify(userData)
      );
      return (state = userData);

    default:
      return state;
  }
};
