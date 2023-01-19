const mongoClient = require("../config/db.config");
const ObjectId = require ("mongodb").ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendMail} = require('../utils/sendMail');
//const {deleteUser} = require('../utils/usersClean');

// Cadastrar usuário
exports.userCreate = async(req, res) => {

  let user = null;

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    const users = [];
    await User.find({ email: req.body.email }).forEach(user => users.push(user));
    if (users.length > 0) user = users[0];

  } catch(err) {
    res.json({ message: err.message} );
  }

  if (user != null) {
    return res.status(400).json({ message: 'E-mail já cadastrado.'} );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = Object.assign({ confirmed: false }, req.body);
  newUser.password = hashedPassword;

  const expiresIn = process.env.CLEAN_TIME * 1;
  const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SECRET, {expiresIn});
  //newUser.token = token;

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    await User.insertOne(newUser).then(result => user = result.ops[0]);
    
    await sendMail(req.body.email, token);
    //deleteUser(expiresIn * 1000, user.id);

    res.status(201).json({ usuario: user._id });

  } catch(err) {
    res.json({ message: err.message} );
  }
};

// Fazer login
exports.userLogin = async(req, res) => {

  let user = null;

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    const users = [];
    await User.find({ email: req.body.email }).forEach(user => users.push(user));
    if (users.length > 0) user = users[0];

  } catch(err) {
    res.json({ message: err.message });
  }

  let message = 'E-mail ou senha inválidos.';
  if (user == null) {
    return res.status(400).json({ message: message });
  }

  if (!user.confirmed) {
    message = 'Conta não confirmada.';
    return res.status(400).json({ message: message });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: message });
  }

  const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  res.header('Auth-Token', token).json({ token: token });
};

// Verificar
exports.userVerify = async(req, res) => {

  let email = null;

  try {

    ({ email } = jwt.verify(req.params.token, process.env.TOKEN_SECRET));
    console.log(email)

  } catch(err) {
    res.status(400).send('Invalid Token')
  }

  if (email != null) {

    console.log(email)

    try {

      await mongoClient.connect();
      const database = mongoClient.db(process.env.MONGO_DATABASE);
      const User = database.collection("User");

      await User.updateOne({ email }, { $set: {confirmed: true} }).then(result => console.log(result));

      res.status(204).send();

    } catch(err) {
      res.send({ message: err.message });
    }
  }
};

// Detalhar um usuario
exports.userRead = async(req, res) => {

  console.log(req.user);

  if (!req.user.isAdmin && req.params.id !== req.user._id) {
    return res.send({ message: 'No permission' });
  }

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    let user = null;
    let users = [];
    await User.find({ _id: ObjectId(req.params.id) }).forEach(user => users.push(user));
    if (users.length > 0) user = users[0];

    res.json({ usuario: user });

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Listar todos os usuarios
exports.userList = async(req, res) => {

  if (!req.user.isAdmin) {
    return res.send({ message: 'No permission' });
  }

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    const users = [];
    await User.find().forEach(user => users.push(user));

    res.json({ users });

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Atualizar um usuario
exports.userUpdate = async(req, res) => {

  if (!req.user.isAdmin && req.params.id !== req.user._id) {
    return res.send({ message: 'No permission' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = Object.assign({}, {
    username: req.body.username,
  });
  newUser.password = hashedPassword;

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    await User.updateOne({ _id: ObjectId(req.params.id) }, { $set: newUser });

    res.status(204).send();

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Apagar um usuário
exports.userDelete = async(req, res) => {

  if (!req.user.isAdmin && req.params.id !== req.user._id) {
    return res.send({ message: 'No permission' });
  }

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const User = database.collection("User");

    await User.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(204).send();

  } catch(err) {
    res.send({ message: err.message });
  }
};

