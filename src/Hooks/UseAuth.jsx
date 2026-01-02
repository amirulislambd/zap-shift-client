import { use, useContext } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";

const UseAuth = () => {
  const authInfo = useContext(AuthContext);
  return authInfo;
};

export default UseAuth;
