import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/features/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import OAuth from "../components/OAuth";
import { useCookies } from "react-cookie";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [, setCookies] = useCookies();

  const { loading, error } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(
        "https://real-estate-mern-server.vercel.app/api/auth/signin",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      const expiryDate = new Date(); // Create a new Date object
      expiryDate.setDate(expiryDate.getDate() + 7);

      setCookies("access_token", data.token, {
        expires: expiryDate,
        path: "/",
        domain:'.vercel.app',
        secure: true,
      });
      dispatch(signInSuccess(data.rest));
      navigate("/");
    } catch (error: any) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <div className="relative">
          <div className="flex items-center">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-3 rounded-lg flex-1"
              id="password"
              onChange={handleChange}
            />
            <div className="absolute right-3">
              {showPassword ? (
                <BiShow
                  className="text-gray-500 cursor-pointer"
                  onClick={handleShowPassword}
                />
              ) : (
                <BiHide
                  className="text-gray-500 cursor-pointer"
                  onClick={handleShowPassword}
                />
              )}
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignIn;
