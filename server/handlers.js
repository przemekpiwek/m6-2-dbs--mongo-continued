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

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  if (!creditCard || !expiration || !fullName | !email) {
    return res.status(404).json({
      status: 400,
      response: "Please provide all info",
    });
  }

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Exercise6_2");
    const query = { _id: seatId };
    const newValues = { $set: { isBooked: "true", fullName, email } };
    const r = await db.collection("seats").updateOne(query, newValues);
    assert.strictEqual(1, r.matchedCount);
    assert.strictEqual(1, r.modifiedCount);
    return res.status(201).json({
      status: 201,
      response: "success",
    });
  } catch (error) {
    res.json({
      status: 500,
      response: error.stack,
    });
  }
};
module.exports = { getSeats, bookSeat };
