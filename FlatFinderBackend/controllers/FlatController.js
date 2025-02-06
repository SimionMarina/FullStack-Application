let FlatModel = require("../models/FlatModel");

exports.createFlat = function (req, res, next) {
  console.log("Request Body:", req.body);
  let newFlat = req.body;
  let flat = new FlatModel(newFlat);
  flat
    .save()
    .then((data) => {
      console.log("Flat saved successfully:", data);
      res
        .status(201)
        .json({ message: "Flat successfully created", data: data });
    })
    .catch((err) => {
      res.json({ err: err });
    });
};

exports.getflatbyID = async function (req, res, next) {
  let flatID = req.params.id;
  let flat = await FlatModel.findOne({ _id: flatID });
  if (!flat) {
    res.json({ error: "Flat does not exist!" });
    return;
  }
  res.json({ data: flat });
};

exports.getFlatbyOwnerId = async function (req, res) {
  const { ownerId } = req.params;
  console.log(req.params);
  try {
    const flats = await FlatModel.find({ ownerID: ownerId });

    if (!flats || flats.length === 0) {
      return res
        .status(404)
        .json({ message: "No flats found for this owner." });
    }

    res.status(200).json(flats);
  } catch (error) {
    console.error("Error fetching flats by owner:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAllFlats = function (req, res, next) {
  FlatModel.find({})
    .then((data) => {
      res.json({ data: data });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.flatsCount = async(req,res,next) => {
  try {
      const userId = req.params.userId;
      console.log('userId:', userId); // Verifică valoarea ID-ului

      // Numără apartamentele pentru utilizatorul respectiv
      const flatsCount = await FlatModel.countDocuments({ ownerID: userId });

      res.json({ count: flatsCount });
  } catch (error) {
      console.error('Error counting flats:', error);
      res.status(500).send('Server error');
  }
};

exports.favoriteFlats = async (req, res) => {
  const { flatIds } = req.body;
  if (!flatIds || flatIds.length === 0) {
    return res.status(400).json({ error: "Invalid or empty flat IDs array." });
  }

  try {
    const flats = await FlatModel.find({ _id: { $in: flatIds } });
    if (flats.length === 0) {
      return res
        .status(404)
        .json({ message: "No flats found for the provided IDs." });
    }

    res.status(200).json(flats);
  } catch (error) {
    console.error("Error fetching favorite flats:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.deleteFlat = function (req, res, next) {
  let id = req.params.id;
  FlatModel.findByIdAndDelete(id)
    .then((data) => {
      res.status(201).json({ message: "Flat deleted", data: data });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

exports.updateFlat = async function (req, res, next) {
  const flatID = req.params.id;
  const updatedData = req.body;

  try {
    const flat = await FlatModel.findByIdAndUpdate(flatID, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure data validation
    });

    if (!flat) {
      return res.status(404).json({ error: "Flat not found" });
    }

    res.status(200).json({ message: "Flat updated successfully", data: flat });
  } catch (error) {
    console.error("Error updating flat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};