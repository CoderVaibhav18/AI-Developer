// import React from "react";
// import { useLocation } from "react-router-dom";
import { createRef, useEffect, useState } from "react";
import axios from "../config/axiosInstance";
import { useLocation } from "react-router-dom";
import { initializeSocket, sendMsg, receiveMsg } from "../config/socket";
// import { userContextData } from "../context/UserContext";
import Markdown from "markdown-to-jsx";

const Project = () => {
  const [isModalPanel, setIsModalPanel] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectUserId, setSelectUserId] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  // const { user } = useContext(userContextData);
  const location = useLocation();
  const [projects, setProjects] = useState(location.state.project);
  const userObj = JSON.parse(localStorage.getItem("user"));
  const messageBox = createRef();
  const [messages, setMessages] = useState([]);

  const handleUserClick = (id) => {
    setSelectUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return Array.from(newSelectedUserId);
    });
  };

  const sendMessage = () => {
    sendMsg("project-message", {
      message,
      sender: userObj,
    });
    appendOutGoingMsg(message, userObj);

    setMessage("");
  };

  useEffect(() => {
    initializeSocket(projects._id);

    receiveMsg("project-message", (data) => {
      console.log(data);
      appendIncommingMsg(data);
    });

    axios
      .get(`/project/getprojects/${location.state.project._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setProjects(res.data.projects);
      });

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
  }, [location.state.project._id, projects._id]);

  const addCollaborators = () => {
    axios
      .put(
        "/project/addusers",
        {
          projectId: location.state.project._id,
          users: Array.from(selectUserId),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsModalPanel(false);
      })
      .catch((err) => console.log(err.message));
  };

  const appendIncommingMsg = (msgObj) => {
    const msgBox = document.querySelector(".message-box");

    const msg = document.createElement("div");

    msg.classList.add(
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "rounded-md",
      "w-fit"
    );
    if (msgObj.sender._id === "ai") {
      const markDown = <Markdown>${msgObj.message}</Markdown>;
      msg.innerHTML = `
      <small className="opacity-65 text-xs">${msgObj.sender.email}</small>
      <p className="text-sm">${markDown}</p>
    `;
    } else {
      msg.innerHTML = `
      <small className="opacity-65 text-xs">${msgObj.sender.email}</small>
      <p className="text-sm">${msgObj.message}</p>
    `;
      msgBox.appendChild(msg);
    }

    setMessage("");
    scrollToBottom();
  };

  const appendOutGoingMsg = (msgObj, userObj) => {
    const msgBox = document.querySelector(".message-box");
    const msg = document.createElement("div");

    msg.classList.add(
      "max-w-56",
      "flex",
      "ml-auto",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "rounded-md",
      "w-fit"
    );
    msg.innerHTML = `
      <small className="opacity-65 text-xs">${userObj.email}</small>
      <p className="text-sm">${msgObj}</p>
    `;
    msgBox.appendChild(msg);
    setMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
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

        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div
            ref={messageBox}
            className="message-box p-2 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
          ></div>

          <div className="inputField w-full flex absolute bottom-0">
            <input
              className="p-2 px-4 border-none outline-none flex-grow bg-amber-50"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
            />
            <button
              onClick={sendMessage}
              className=" px-5 bg-slate-950 hover:bg-slate-800 text-white"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidepanel flex flex-col gap-2 bg-slate-50 w-full h-full top-0 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between items-center font-medium text-lg p-2 px-3 bg-slate-300">
            <h2>Collaborators</h2>

            <button
              className="p-2 text-xl cursor-pointer"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>

          {projects.users.map((user, idx) => (
            <div key={idx} className="users flex flex-col  gap-2">
              <div className="user flex items-center cursor-pointer hover:bg-slate-200 p-3  gap-2">
                <div className="aspect-square bg-slate-600 flex items-center justify-center h-fit w-fit rounded-full p-5 text-white">
                  <i className="ri-user-fill absolute"></i>
                </div>

                <h1 className="text-lg font-semibold">{user.email}</h1>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalPanel && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button
                onClick={() => setIsModalPanel(false)}
                className="p-2 cursor-pointer"
              >
                <i className="ri-close-fill font-semibold text-lg"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    Array.from(selectUserId).indexOf(user._id) != -1
                      ? "bg-slate-200"
                      : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>
            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md"
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
