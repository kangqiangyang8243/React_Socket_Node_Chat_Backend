const router = require("express").Router();
const Messages = require("../models/messageModel");

// get all messages
router.post("/getAllMsgs", async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    // console.log(messages);

    const projectedMessages = messages.map((message) => {
      return {
        fromSelf: message.sender.toString() === from,
        message: message.message.text,
        sendDate: message.sendDate,
      };
    });
    // console.log(projectedMessages);
    res.status(200).json(projectedMessages);
  } catch (error) {
    res.status(500).json(error);
  }
});

// send message
router.post("/addMsg", async (req, res) => {
  try {
    const { from, to, message } = req.body;

    const newMsg = {
      message: { text: message },
      users: [from, to],
      sender: from,
    };

    const data = await Messages.create(newMsg);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
