import socket from "socket.io-client";

let socketInstance = null;

// fonction to connect with server set with token from localStorage
const initializeSocket = (projectId) => {
  socketInstance = socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });

  return socketInstance;
};

const receiveMsg = (eventName, cd) => {
  socketInstance.on(eventName, cd);
};

const sendMsg = (eventName, data) => {
  socketInstance.emit(eventName, data);
};

export { initializeSocket, receiveMsg, sendMsg };
