require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const MONGO_USER = process.env.MONGO_DB_USERNAME;
const MONGO_PASS = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@auth.kr7x4gt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db(MONGO_DB_NAME);

const apps = database.collection(MONGO_COLLECTION);

async function registerUser(req) {
  const user = req.user;
  const query = { user: user };
  const entries = await apps.findOne(query);

  if (entries != null) return [false, "User Already Exists!"];

  apps.insertOne({
    user: req.user,
    pass: req.pass,
    wins: 0,
    loses: 0,
    "total games": 0,
  });
  return [true, "success"];
}

async function loginUser(req) {
  const query = { user: req.user };
  const entries = await apps.findOne(query);
  let message = "";

  if (entries != null) {
    if (req.pass === entries.pass) {
      return [true, "Success!"];
    } else {
      message = "Password Incorrect!";
    }
  } else {
    message = "User Not Found!";
  }

  return [false, message];
}

async function addResults(user, won) {
  const wins = won ? 1 : 0;
  const loses = won ? 0 : 1;

  console.log(user);
  apps.updateOne(
    { user: user },
    { $inc: { wins: wins, loses: loses, "total games": 1 } }
  );
}

async function leaderBoard() {
  const results = await apps.aggregate([
    { $sort: { wins: -1 } },
    { $limit: 10 },
  ]);
  console.log("results:", results);
  return results;
}

module.exports = { registerUser, loginUser, addResults, leaderBoard };
