// import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [hidePass, setHidePass] = useState("password");
  const [eyeChange, setEyeChange] = useState(true); // Fixed initial state

  const handleShowPass = () => {
    if (eyeChange) {
      setEyeChange(false);
      setHidePass("text");
    } else {
      setEyeChange(true);
      setHidePass("password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 w-full max-w-md p-8 rounded-lg">
        <h2 className="font-bold text-2xl text-white mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
              placeholder="Email"
            />
          </div>
          <div className="mb-3 relative">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <h2
              onClick={() => handleShowPass()}
              className="text-xl absolute right-5 top-10 cursor-pointer"
            >
              <i
                className={`${eyeChange ? "ri-eye-off-line" : "ri-eye-line"}`}
              ></i>
            </h2>
            <input
              type={hidePass}
              id="password"
              className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
              placeholder="Password"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 mt-2 p-3 outline-none rounded-lg text-white border-none"
            type="submit"
          >
            Login {/* Fixed button text */}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-3">
          Don&apos;t have account?{" "}
          <Link className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
