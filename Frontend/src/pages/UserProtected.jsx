import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtected = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return <div></div>;
};

export default UserProtected;
