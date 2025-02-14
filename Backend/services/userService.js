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
export { userCreate };
