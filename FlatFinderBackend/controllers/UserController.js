let UserModel = require("../models/UserModel");
let utils = require("../utils/utils");

exports.createUser = function (req, res, next) {
  let newUser = req.body;
  let user = new UserModel(newUser);
  user
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ err: err });
    });
};

exports.loginUser = async function (req, res) {
  const { email, password } = req.body;
  try {
    //Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    // Verify password
    const isPasswordValid = utils.auth(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials." });
    }

    // Generate token
    const token = utils.signToken(user._id);

    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.id; // Use the route parameter instead of req.userId
    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching user data." });
  }
};

exports.getAllUsers = async function (req, res) {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.deleteUser = function (req, res, next) {
  let id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then((data) => {
      res.status(201).json({ message: "User deleted", data: data });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const updates = req.body;

  // Validate input
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update provided." });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      ...updates,
      updated: new Date(),
    });

    if (!updatedUser) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.verifyToken = async function (req, res, next) {
  token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token supplied" });
  }

  try {
    // Verify the token
    const decodedToken = utils.decodeToken(token);

    if (decodedToken) {
      // Fetch the user from the database
      const user = await UserModel.findById(decodedToken.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send user data back to the client
      res.status(200).json({ user });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.isAdmin = function (req, res, next) {
  if (req.user.permission == "admin") {
    next();
  } else {
    res.status(400).json({ error: "you dont have permission" });
  }
};

exports.forgotPassword = async function (req, res, next) {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.json({ error: "Please specify email!" });
      return;
    }
    let resetToken = utils.signToken(user._id);
    user.passwordChangeToken = resetToken;
    await user.save();

    let url = `${req.protocol}:/${req.get("host")}/resetPassword/${resetToken}`;
    let message = "Click on the link to reset your password: ";
    await utils.sendEmail({
      from: "myapplication@noreply.com",
      email: user.email,
      subject: "Reset password",
      text: `${message} \r\n ${url}`,
    });
    res.json({ message: "Sent email!" });
  } catch {
    user.passwordChangeToken = undefined;
    user.save();
    res.json({ error: "Email cound not be sent!" });
  }
};

exports.resetPassword = async function (req, res, next) {
  let token = req.params.token;
  if (utils.verifyToken(token)) {
    let user = await UserModel.findOne({ passwordChangeToken: token });
    if (!user) {
      res.json({
        error: "User does not exist or has not requested password change",
      });
      return;
    }
    user.password = req.body.password;
    user.passwordChangeToken = undefined;
    await user.save();
    let newToken = utils.signToken(user._id);
    res.json({ status: newToken });
  }
};
