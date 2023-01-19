require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(
  process.env.MONGO_URI,
  { useUnifiedTopology: true, useNewUrlParser: true }
);

module.exports = mongoClient;
