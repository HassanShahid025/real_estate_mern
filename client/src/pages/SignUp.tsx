import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleShowSuccessMessage = () => {
    setShowSuccessMessage(true)
    const timer = setTimeout(() => {
      navigate('/sign-in')
    },2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      handleShowSuccessMessage()
    } catch (error: unknown) {
      setLoading(false);
      setError(error.message);
    }
  };



  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
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
              type={showPassword ? "text":"password"}
              placeholder="Password"
              className="border p-3 rounded-lg flex-1"
              id="password"
              onChange={handleChange}
            />
            <div className="absolute right-3">
              {showPassword ? (
                  <BiShow className="text-gray-500 cursor-pointer" onClick={handleShowPassword}/>
              ) : (
                <BiHide className="text-gray-500 cursor-pointer" onClick={handleShowPassword}/>
              )}
              
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        {/* <OAuth/> */}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {showSuccessMessage && <p className="text-green-500 mt-5">User created successfully</p>}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
