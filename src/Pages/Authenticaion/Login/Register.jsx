import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../../Hooks/UseAuth";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ FIXED
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import UseAxios from "../../../Hooks/UseAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = UseAxios();

  const { createUser, updateUserProfile } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || location.state?.from || "/";

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log("User Created:", result.user);

        // update userInfo in the database
        const userInfo = {
          email: data.email,
          role: "user", //default role
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        const useRes = await axiosInstance.post("/users", userInfo);
        console.log(useRes.data);

        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name pic updated");
          })
          .catch((error) => {
            console.log(error);
          });

        navigate(from, { replace: true }); // ✅ Will redirect properly
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create an Account</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Name"
            />
            {errors.email && <p className="text-red-500">Name is required</p>}
            {/* Profile URL */}
            <label className="label">Your Profile picture</label>
            <input
              type="file"
              onChange={handelImageUpload}
              className="input"
              placeholder="Your Profile picture"
            />

            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be 6 characters or longer
              </p>
            )}

            <button className="btn btn-primary mt-4 text-black">
              Register Now
            </button>
          </fieldset>

          <p>
            <small>
              Already have an account?{" "}
              <Link to="/login" state={location.state} className="btn btn-link">
                Login
              </Link>
            </small>
          </p>
        </form>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
