import { useContext } from "react";
import { userContextData } from "../context/UserContext";

const Home = () => {
  const { user } = useContext(userContextData);

  return <div>Home: {user.email}</div>;
};

export default Home;
