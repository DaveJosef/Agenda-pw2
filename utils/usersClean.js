const mongoClient = require("../config/db.config");

const del = async(id, interval) => {

    clearInterval(interval);

    try {

      await mongoClient.connect();
      const database = mongoClient.db(process.env.MONGO_DATABASE);
      const User = database.collection("User");

      const user = null;
      const users = [];
      await User.find({ id }).forEach(user => users.push(user));
      if (users.length > 0) user = users[0];
  
      if (user.confirmed === false) {

        await User.deleteOne({ id });

        console.log({ deletedUser: id });

      } else {
        console.log({ userConfirmed: 1 });
      }
    } catch(err) {
      console.log({ message: err.message });
    }
}

const delAll = async() => {

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    const date = new Date(new Date() - 1000 * process.env.CLEAN_TIME);
    console.log(date <= new Date());

    const deleted = await User.deleteMany({
        confirmed: false,
        createdAt: {
            $lte: date
        }
    });

    console.log({ deleted });

  } catch(err) {
    console.log({ message: err.message });
  }
}
/*
exports.deleteUser = async(ms, id) => {
    let time = 1;
    const interval = setInterval(() => {console.log(`Time passed for account ${id} deletion: ${time}secs`); time++}, 1000);
    const timeout = setTimeout(function() {del(id, interval)}, ms);
}
*/
exports.cleanAccounts = async(ms) => {
    let time = 1;
    const intervalLog = setInterval(() => {console.log(`Time passed for accounts cleaning: ${time}secs`); time++}, 1000);
    const interval = setInterval(function() {delAll(); time = 1}, ms);
    date = new Date();
    console.log(date);
}
