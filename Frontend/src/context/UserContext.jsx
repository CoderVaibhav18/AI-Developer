import { createContext, useState } from "react";
import propTypes from "prop-types";

// eslint-disable-next-line react-refresh/only-export-components
export const userContextData = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const value = { user, setUser };

  return (
    <userContextData.Provider value={value}>
      {children}
    </userContextData.Provider>
  );
};
UserContext.propTypes = {
  children: propTypes.node.isRequired, // Ensures 'children' is a valid React node and required
};

export default UserContext;
