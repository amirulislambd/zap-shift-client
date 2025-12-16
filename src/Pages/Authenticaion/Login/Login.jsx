import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ CORRECT IMPORT
import SocialLogin from "../SocialLogin/SocialLogin";
import UseAuth from "../../../Hooks/UseAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from =
  location.state?.from?.pathname ||
  location.state?.from ||
  "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate(from, { replace: true }); // ✅ This will now work
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Please Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />

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
                Password Must be 6 characters or longer.
              </p>
            )}
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
          </fieldset>
          <button
            type="submit"
            className="btn btn-primary btn-block text-black mt-4"
          >
            Login
          </button>
        </form>
        <p>
          <small>
            New to this website?
            <Link state={{ from: location.state?.from }} className="btn btn-link " to="/register">
              Register
            </Link>
          </small>
        </p>
        <SocialLogin />
      </div>
    </div>
  );
};

export default Login;
