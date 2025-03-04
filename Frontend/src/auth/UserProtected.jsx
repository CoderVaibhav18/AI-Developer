import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axiosInstance";
import { userContextData } from "../context/UserContext";
import PropTypes from "prop-types";

const UserProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(userContextData);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    if (!user) {
      navigate("/login");
    }

    axios
      .get(`/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [token, navigate, user]);

  if (isLoading) {
    return (
      <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    );
  }

  return <>{children}</>;
};

UserProtected.propTypes = {
  children: PropTypes.node.isRequired, // Ensures 'children' is a valid React node and required
};

export default UserProtected;
