import { useState } from "react";
import axios from "../config/axiosInstance";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [projectCreatePanel, setProjectCreatePanel] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [projectCreated, setProjectCreated] = useState(0); // New state to trigger refresh

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/project/create",
        { name: projectName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          const data = response.data;
          alert("project created : " + data.newProject.name);
          // Update projects list immediately
          setProjects((prev) => [...prev, data.newProject]);
          // Trigger refresh counter
          setProjectCreated((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    setProjectName("");
    setProjectCreatePanel(false);
  };

  useEffect(() => {
    axios
      .get("/project/allprojects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setProjects(res.data.projects);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [token, projectCreated]); // Added projectCreated as dependency

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      setDeletingId(projectId);
      await axios
        .delete(`/project/deleteproject/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          alert("deleted " + res.data.msg);
          setProjects((prev) => prev.filter((p) => p._id !== projectId));
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
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

        {
          /* Project Create Panel */
          projects && projects.length > 0 ? (
            <div className="bg-red-50 w-full mt-5 p-4 flex gap-3 rounded-lg shadow-sm border border-red-100">
              {projects.map((project) => (
                <button
                  className="relative border border-red-200 px-4 py-2.5 rounded-md
                 hover:border-red-300 hover:bg-red-100 transition-all
                 group bg-white text-red-900 hover:text-red-950"
                  key={project._id}
                  onClick={() =>
                    navigate("/project", {
                      state: { project },
                    })
                  }
                >
                  <span className="flex items-center gap-2">
                    {project.name}
                    <div>
                      <small>
                        <i className="ri-user-3-fill text-red-400 group-hover:text-red-500"></i>
                      </small>
                      <small>{project.users.length}</small>
                    </div>
                  </span>

                  {/* Delete button */}

                  <Link
                    className="absolute -top-3 -right-3 h-7 w-7 flex items-center 
             justify-center bg-red-500 text-white rounded-full
             hover:bg-red-600 transition-colors shadow-sm
             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    aria-label={`Delete project ${project.name}`}
                  >
                    {deletingId === project._id ? (
                      <i className="ri-loader-4-line animate-spin text-xs"></i>
                    ) : (
                      <i className="text-xs ri-delete-bin-7-fill"></i>
                    )}
                  </Link>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 space-y-3 text-center">
              <i className="ri-folders-line text-4xl text-red-300"></i>
              <p className="text-red-500 font-medium">No projects found</p>
              <p className="text-red-400 text-sm max-w-xs mx-auto">
                Create your first project to get started
              </p>
            </div>
          )
        }
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
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full  bg-gray-200 rounded-lg
                    focus:ring-2 focus:ring-blue-400 
                    px-3 py-2 text-gray-900 placeholder-gray-400
                    transition-all outline-none text-md"
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
