import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";
const ZapShiftLogo = () => {
  return (
    <Link to='/'>
      <div className="flex items-end">
        <img className="mb-2" src={logo} alt="" />
        <p className="text-3xl -ml-2">ZapShift</p>
      </div>
    </Link>
  );
};

export default ZapShiftLogo;
