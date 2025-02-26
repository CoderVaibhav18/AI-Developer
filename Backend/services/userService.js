import userModel from "../models/userModel.js";

const userCreate = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email & password are required");
  }

  const hashedPassword = await userModel.hashPass(password);

  const user = await userModel.create({
    email,
    password: hashedPassword,
  });

  return user;
};

const userLoginServices = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email & password are required");
  }

  const user = await userModel.findOne({ email }).select("+password");
  return user;
};

const allUserServices = async ({ userId }) => {
  const allUser = await userModel.find({
    _id: {
      $ne: userId,
    },
  });
  return allUser;
};

export { userCreate, userLoginServices, allUserServices };
