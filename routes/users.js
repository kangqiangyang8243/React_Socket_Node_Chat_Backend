const router = require("express").Router();
const Users = require("../models/userModel");

router.put("/:userId", async (req, res) => {
  try {
    if (req.body.id !== req.params.userId) {
      return res.json({ message: "Invalid user id", status: false });
    }
    const avatarImage = req.body.avatarImage;
    const userData = await Users.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          isAvatarImageSet: true,
          avatarImage,
        },
      },
      { new: true }
    );

    res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
});

// get all users but not including current user
router.get("/:id", async (req, res) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "loginDate",
    ]);

    res.json(users);
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
});

module.exports = router;
