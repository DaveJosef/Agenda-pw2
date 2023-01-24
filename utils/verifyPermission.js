const mongoClient = require("../config/db.config");
const ObjectId = require ("mongodb").ObjectId;

const auth = async(req, res, next) => {

  let authUser = null;

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    const users = [];
    await User.find({ _id: ObjectId(req.user.id) }).forEach(user => users.push(user));

    authUser = users[0];

    req.user.isAdmin = authUser.isAdmin;

    next();

  } catch(err) {
    res.status(400).send({ message: err.message });
  }
}

module.exports = auth;
