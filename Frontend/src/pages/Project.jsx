// import React from "react";
// import { useLocation } from "react-router-dom";

import { useState } from "react";

const Project = () => {
  // const location = useLocation();

  // console.log(location.state);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <main className="h-screen w-screen flex">
      <section className="relative left h-full flex flex-col min-w-96 bg-slate-300">
        <header className="w-full flex justify-end p-2 px-4 bg-slate-100">
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
    </main>
  );
};

export default Project;
