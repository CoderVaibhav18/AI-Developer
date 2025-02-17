import jwt from "jsonwebtoken";
import redisClient from "../services/redisService.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.Authorization.split(" ")[1];

    if (!token) {
      res.status(401).send({ error: "unauthorized user" });
    }

    const isBlackListed = await redisClient.get(token);

    if (isBlackListed) {
      res.clearCookie("token");
      res.status(401).send({ error: "unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;// coder has done it before die
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
export { authUser };
