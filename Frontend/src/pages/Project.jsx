// import React from "react";
// import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "../config/axiosInstance";

const Project = () => {
  // const location = useLocation();
  const [isModalPanel, setIsModalPanel] = useState(false);
  // console.log(location.state);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectUserId, setSelectUserId] = useState([]);

  const [users, setUsers] = useState([]);

  const handleUserClick = (id) => {
    setSelectUserId([...selectUserId, id]);
  };

  useEffect(() => {
    axios
      .get("/user/allusers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUsers(res.data.allUsers);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <main className="h-screen w-screen flex">
      <section className="relative left h-full flex flex-col min-w-96 bg-slate-300">
        <header className="w-full flex justify-between items-center p-2 px-4 max-h-96 overflow-auto bg-slate-100">
          <button
            onClick={() => setIsModalPanel(true)}
            className="cursor-pointer flex gap-1"
          >
            <i className="ri-add-fill mr-1 font-semibold"></i>
            <p>Add collaborator</p>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 cursor-pointer"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex flex-grow flex-col">
          <div className="message-box p-2 flex-grow flex flex-col gap-1">
            <div className="max-w-56 flex flex-col p-2 bg-slate-50 rounded-md w-fit ">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem
              </p>
            </div>

            <div className="max-w-56 ml-auto flex flex-col p-2 bg-slate-50 rounded-md w-fit ">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">lorem lorem lorem lorem lorem</p>
            </div>
          </div>

          <div className="inputField w-full flex">
            <input
              className="p-2 px-4 border-none outline-none flex-grow bg-amber-50"
              type="text"
              placeholder="Enter message"
            />
            <button className=" px-5 bg-slate-950 hover:bg-slate-800 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidepanel flex flex-col gap-2 bg-slate-50 w-full h-full top-0 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-end p-2  px-3 bg-slate-300">
            <button
              className="p-2 text-xl cursor-pointer"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col  gap-2">
            <div className="user flex items-center cursor-pointer hover:bg-slate-200 p-3  gap-2">
              <div className="aspect-square bg-slate-600 flex items-center justify-center h-fit w-fit rounded-full p-5 text-white">
                <i className="ri-user-fill absolute"></i>
              </div>

              <h1 className="text-lg font-semibold">Vaibhav Sathe</h1>
            </div>
          </div>
        </div>
      </section>

      {isModalPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-4 md:p-6 flex flex-col rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between mb-3 items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Select users
              </h2>
              <button
                onClick={() => setIsModalPanel(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="ri-close-line text-2xl " />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {" "}
              {/* Scrollable container */}
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`group relative transition-colors ${
                    selectUserId.indexOf(user._id) != -1
                      ? "bg-slate-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center p-2 md:p-3 gap-3 cursor-pointer">
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 ${
                        selectUserId.includes(user._id)
                          ? "bg-slate-700 ring-2 ring-slate-600"
                          : "bg-slate-600 group-hover:bg-slate-700"
                      } w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
         transition-all`}
                    >
                      <i className="ri-user-fill text-white text-lg md:text-xl" />
                    </div>

                    {/* User Info */}
                    <div className="min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                        {user.email}
                      </h3>
                    </div>

                    {/* Selection Indicator */}
                    {selectUserId.includes(user._id) && (
                      <div className="ml-auto pl-3">
                        <i className="ri-checkbox-circle-fill text-blue-600 text-xl" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              // onClick={addCollaborators}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
