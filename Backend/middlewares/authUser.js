import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.Authorization.split(" ")[1];    

    if (!token) {
      res.status(401).send({ error: "unauthorized user" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};
export { authUser };
