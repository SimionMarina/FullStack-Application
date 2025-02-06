let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let FlatSchema = new Schema(
  {
    city: {
      type: String,
      required: [true, "Must provide a city"],
    },
    streetName: {
      type: String,
      required: [true, "Must provide a street name"],
    },
    streetNumber: {
      type: String,
      required: [true, "Must provide a street number"],
    },
    areaSize: {
      type: Number,
      required: true,
    },
    hasAC: {
      type: Boolean,
      required: true,
    },
    yearBuild: {
      type: Number,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: true,
    },
    dateAvailable: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Date available must not be in the past",
      },
    },
    ownerID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("flat", FlatSchema);