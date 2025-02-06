let MessageModel = require("../models/MessageModel");
let UserModel = require("../models/UserModel");
let FlatModel = require("../models/FlatModel");

exports.addMessage =function (req, res, next) {
  let newMessage = req.body;
  let message = new MessageModel(newMessage);
  message
    .save()
    .then((data) => {
      res.status(201).json({message:"Message send successfully", data:data})
    })
    .catch((err) => {
      res.json({ err: err });
    });
};

//Fetch messages and flat details for the user
exports.getAllMessages = async (req, res) => {
  try{
    const {userId} = req.params;

    // Fetch user with messages
    const user = await UserModel.findById(userId).select('messages');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const messages = user.messages;

    // Get unique flat IDs from messages
    const flatIds = [...new Set(messages.map((msg) => msg.flatId))];

    // Fetch related flat details
    const flats = await FlatModel.find({ _id: { $in: flatIds } });

    // Format flat details into a lookup object
    const flatDetails = flats.reduce((acc, flat) => {
      acc[flat._id.toString()] = flat;
      return acc;
    }, {});

    res.status(200).json({ messages, flatDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inbox data' });
  }
}