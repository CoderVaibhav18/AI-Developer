import { createRef, useEffect, useRef, useState } from "react";
import axios from "../config/axiosInstance";
import { useLocation } from "react-router-dom";
import { initializeSocket, sendMsg, receiveMsg } from "../config/socket";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

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
  const [fileTree, setFileTree] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

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
    // appendOutGoingMsg(message, userObj);

    setMessages((prevMsg) => [...prevMsg, { sender: userObj, message }]);

    setMessage("");
    scrollToBottom();
  };

  function WriteAiMessage(message) {
    const messageObject = JSON.parse(message);
    console.log(messageObject);

    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-3 pr-3">
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }

  useEffect(() => {
    initializeSocket(projects._id);

    receiveMsg("project-message", (data) => {
      // console.log(JSON.parse(data.message));
      // appendIncommingMsg(data);
      const message = JSON.parse(data.message);

      if (message.fileTree) {
        setFileTree(message.fileTree);
      }

      setMessages((prevMsg) => [...prevMsg, data]);
      scrollToBottom();
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

  // const appendIncommingMsg = (msgObj) => {
  //   const msgBox = document.querySelector(".message-box");

  //   const msg = document.createElement("div");

  //   msg.classList.add(
  //     "max-w-56",
  //     "flex",
  //     "flex-col",
  //     "p-2",
  //     "bg-slate-50",
  //     "rounded-md",
  //     "w-fit"
  //   );
  //   if (msgObj.sender._id === "ai") {
  //     const markDown = <Markdown>${msgObj.message}</Markdown>;
  //     msg.innerHTML = `
  //     <small className="opacity-65 text-xs">${msgObj.sender.email}</small>
  //     <p className="text-sm">${markDown}</p>
  //   `;
  //     // msgBox.appendChild(msg);
  //   } else {
  //     msg.innerHTML = `
  //     <small className="opacity-65 text-xs">${msgObj.sender.email}</small>
  //     <p className="text-sm">${msgObj.message}</p>
  //   `;
  //     msgBox.appendChild(msg);
  //   }

  //   setMessage("");
  //   scrollToBottom();
  // };

  // const appendOutGoingMsg = (message, userObj) => {
  //   const msgBox = document.querySelector(".message-box");
  //   const msg = document.createElement("div");

  //   msg.classList.add(
  //     "max-w-56",
  //     "flex",
  //     "ml-auto",
  //     "flex-col",
  //     "p-2",
  //     "bg-slate-50",
  //     "rounded-md",
  //     "w-fit"
  //   );
  //   msg.innerHTML = `
  //     <small className="opacity-65 text-xs">${userObj.email}</small>
  //     <p className="text-sm">${message}</p>
  //   `;
  //   msgBox.appendChild(msg);
  //   scrollToBottom();
  // };

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
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
                } ${
                  msg.sender._id == userObj._id && "ml-auto"
                }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <div className="text-sm">
                  {msg.sender._id === "ai" ? (
                    WriteAiMessage(msg.message)
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

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

      <section className="right bg-slate-100 flex h-full flex-grow">
        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200 ">
          <div className="filetree w-full flex flex-col gap-2">
            {Object.keys(fileTree).map((file, index) => (
              <button
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                key={index}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 w-full bg-slate-300"
              >
                <p className=" font-semibold text-lg">{file}</p>
              </button>
            ))}
          </div>
        </div>

        {currentFile && (
          <div className="code-editor flex flex-grow h-full flex-col">
            <div className="top">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  className={`open-file cursor-pointer p-2 px-4 items-center gap-2 bg-slate-300 ${
                    currentFile === file ? "bg-slate-400" : ""
                  }`}
                  onClick={() => setCurrentFile(file)}
                >
                  <p className="font-semibold text-lg">{file}</p>
                </button>
              ))}
            </div>
            <div className="bottom flex flex-grow">
              {fileTree[currentFile] && (
                <div className="code-editor-area h-full overflow-auto flex-grow p-2 bg-slate-50">
                  <pre className="hljs h-full">
                    <code
                      className="hljs h-full outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedContent = e.target.innerText;
                        const ft = {
                          ...fileTree,
                          [currentFile]: {
                            file: {
                              contents: updatedContent,
                            },
                          },
                        };
                        setFileTree(ft);
                      }}
                      dangerouslySetInnerHTML={{
                        __html: hljs.highlight(
                          "javascript",
                          fileTree[currentFile].file.contents
                        ).value,
                      }}
                      style={{
                        whiteSpace: "pre-wrap",
                        paddingTop: "4rem",
                        paddingBottom: "25rem",
                        counterSet: "line-numbering",
                      }}
                    />
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
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
