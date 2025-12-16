import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png"
import ZapShiftLogo from "../Pages/shared/ZapShiftLogo/ZapShiftLogo";

const AuthLayout = () => {
  return (
    <div className="p-12 bg-base-200 ">
        <ZapShiftLogo/>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex-1">
            <img
          src={authImg}
          className="max-w-sm rounded-lg shadow-2xl"
        />
        </div>
        <div className="flex-1">
            <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
