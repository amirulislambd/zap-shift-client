import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import UseAuth from "../../../Hooks/UseAuth";
import axiosSecure from "../../../Hooks/useAxiosSecure";

const SocialLogin = () => {
  const { signinWithGoogle } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // redirect path (protected route support)
  const from = location.state?.from?.pathname || "/dashboard";

  const handleGoogleSignIn = async () => {
    try {
      // 1️⃣ Google Sign In
      const result = await signinWithGoogle();
      const user = result.user;

      if (!user) {
        throw new Error("Google login failed: user not found");
      }

      // 2️⃣ Prepare user info for DB
      const userInfo = {
        name: user.displayName || "",
        email: user.email,
        photoURL: user.photoURL || "",
        role: "user", // default
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      // 3️⃣ Save / update user in MongoDB (Firebase token auto attached)
      await axiosSecure.post("/users", userInfo);

      // 4️⃣ Navigate after success
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  return (
    <div className="w-full text-center">
      <p className="my-3 text-gray-500">OR</p>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="btn w-full flex items-center justify-center gap-3
                   bg-white text-black border border-gray-300
                   hover:bg-gray-100 transition"
      >
        <FcGoogle size={22} />
        <span className="font-medium">Login with Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;
