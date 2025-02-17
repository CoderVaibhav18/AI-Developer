// import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [hidePass, setHidePass] = useState("password");
  const [eyeChange, setEyeChange] = useState(true); // Fixed initial state

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleShowPass = () => {
    if (eyeChange) {
      setEyeChange(false);
      setHidePass("text");
    } else {
      setEyeChange(true);
      setHidePass("password");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let userData = {
      email: email,
      password: password,
    };

    console.log(userData);
  };

  return (
    <div className="h-screen px-5 flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 w-full max-w-md p-8  rounded-lg">
        <h2 className="font-bold text-2xl text-white mb-4">Register User</h2>
        <form onSubmit={(e) => submitHandler(e)}>
          <div className="mb-3">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
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
                className={`${eyeChange ? "ri-eye-off-line" : "ri-eye-line"} text-amber-50`}
              ></i>
            </h2>
            <input
              type={hidePass}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 p-3 outline-none rounded-lg text-white border-none"
              placeholder="Password"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 mt-2 p-3 outline-none rounded-lg text-white border-none"
            type="submit"
          >
            Sign up {/* Fixed button text */}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-3">
          Already have account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
