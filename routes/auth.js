const router = require("express").Router();
const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, loginDate } = req.body;
    const usernameCheck = await Users.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await Users.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
      loginDate,
    });
    delete user.password;

    res.status(201).json({ status: true, user });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { username, password, loginDate } = req.body;
    const user = await Users.findOne({ username });

    if (!user) {
      return res.json({ msg: "User not found", status: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid password", status: false });
    }
    delete user.password;
    res.status(200).json({ status: true, user });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
