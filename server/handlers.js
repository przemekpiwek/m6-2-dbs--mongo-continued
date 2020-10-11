"use strict";

const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Exercise6_2");
    const seats = await db.collection("seats").find().toArray();
    const allSeats = {};

    seats.forEach((seat) => {
      allSeats[seat._id] = seat;
    });
    res.status(200).json({
      seats: allSeats,
    });
    client.close();
  } catch (error) {
    res.status(500).json({ status: 500, error: error.stack });
  }
};

const bookSeat = async (req, res) => {};

module.exports = { getSeats, bookSeat };
