// import React from "react";
import { useState } from "react";

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
            <input
              type="email"
              className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
              placeholder="Email"
            />
          </div>
          <div className="mb-3 relative">
            <h2
              onClick={() => handleShowPass()}
              className="text-xl absolute right-5 top-3 cursor-pointer"
            >
              <i
                className={`${eyeChange ? "ri-eye-line" : "ri-eye-off-line"}`}
              ></i>
            </h2>
            <input
              type={hidePass}
              className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
              placeholder="Password"
            />
          </div>
          <button
            className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
            type="submit"
          >
            Login {/* Fixed button text */}
          </button>
        </form>
        <p className="text-center text-white mt-3">
          Don&apos;t have account? <a>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
