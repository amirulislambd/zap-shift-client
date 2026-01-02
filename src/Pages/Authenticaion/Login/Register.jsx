import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../SocialLogin/SocialLogin";
import UseAuth from "../../../Hooks/UseAuth";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // -----------------------
  // Handle image upload
  // -----------------------
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    fetch(
      "https://api.imgbb.com/1/upload?key=45d02960d828577fe552be49cc78aaa3",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.data.display_url || data.data.url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Image upload failed:", err);
        setLoading(false);
      });
  };

  // -----------------------
  // Handle form submit
  // -----------------------
  const onSubmit = (data) => {
    if (!imageUrl) {
      alert("Please upload a profile photo");
      return;
    }

    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;

        // 1️⃣ Update Firebase profile
        updateUserProfile({
          displayName: data.name,
          photoURL: imageUrl,
        })
          .then(() => {
            // 2️⃣ Get Firebase token
            user.getIdToken().then((token) => {
              // 3️⃣ Save user to MongoDB
              const savedUser = {
                name: data.name,
                email: data.email,
                photoURL: imageUrl,
                created_at: new Date(),
              };

              fetch("https://zap-shift-server-sigma-two.vercel.app/users", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(savedUser),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("User saved to DB:", data);
                  navigate(from, { replace: true });
                })
                .catch((err) => console.log("DB save error:", err));
            });
          })
          .catch((err) => console.log("Profile update error:", err));
      })
      .catch((error) => console.log("Create user error:", error));
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="label">Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="input"
            {...register("name", { required: true })}
          />
          {errors.name && <p className="text-red-500">Name is required</p>}

          <label className="label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="input"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-red-500">Email is required</p>}

          <label className="label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="input"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be at least 6 characters
            </p>
          )}

          <label className="label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={handleImageUpload}
          />
          {loading && <p className="text-blue-500">Uploading image...</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-20 h-20 mt-2 rounded-full"
            />
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4 text-black"
          >
            Register
          </button>
        </form>

        <p>
          <small>
            Already have an account?{" "}
            <Link
              state={{ from: location.state?.from }}
              className="btn btn-link"
              to="/login"
            >
              Login
            </Link>
          </small>
        </p>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
