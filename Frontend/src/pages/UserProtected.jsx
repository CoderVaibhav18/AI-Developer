import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/user/profile`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          console.log(data.user);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    );
  }

  return <>{children}</>;
};

export default UserProtected;
