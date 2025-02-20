import { useState } from "react";
import axios from "../config/axiosInstance";

const Home = () => {
  const [projectCreatePanel, setProjectCreatePanel] = useState(false);
  const [projectName, setProjectName] = useState("");

  const token = localStorage.getItem("token");

  const submitHandler = (e) => {
    e.preventDefault();

    let createProjects = {
      name: projectName,
    };

    axios
      .post("/project/create", createProjects, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 201) {
          const data = response.data;
          console.log(data.newProject);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <main className="min-h-screen w-full max-w-7xl mx-auto p-4 overflow-hidden">
      <div className="p-4">
        <button
          onClick={() => setProjectCreatePanel(true)}
          className="border-none font-semibold outline-none cursor-pointer 
         text-white bg-blue-600 rounded-lg px-4 py-3
          hover:bg-blue-700 transition-colors duration-200
          text-sm md:text-base"
        >
          <h4 className="flex items-center justify-center gap-1">
            <i className="text-xl ri-add-line align-middle"></i> New Project
          </h4>
        </button>
      </div>

      {projectCreatePanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 flex flex-col gap-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Create project
              </h2>
              <button
                onClick={() => setProjectCreatePanel(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="ri-close-line text-2xl" />
              </button>
            </div>

            <form onSubmit={(e) => submitHandler(e)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    px-4 py-2.5 text-gray-900 placeholder-gray-400
                    transition-all outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-5 py-2.5 rounded-lg
                    hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
                    focus:ring-offset-2 transition-colors font-medium"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setProjectCreatePanel(false)}
                  className="w-full bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg
                    hover:bg-gray-200 focus:ring-2 focus:ring-gray-400
                    focus:ring-offset-2 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
