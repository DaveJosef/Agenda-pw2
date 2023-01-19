const mongoClient = require('../config/db.config');
const ObjectId = require ("mongodb").ObjectId;

// Listar todos os contatos
exports.contatosList = async(req, res) => {
  
  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const Contato = database.collection("Contato");

    const contatos = [];
    await Contato.find().forEach(contato => contatos.push(contato));
    
    res.json({ contatos });

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Detalhar um contato
exports.contatosRead = async(req, res) => {
  
  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const Contato = database.collection("Contato");

    const contatos = [];
    await Contato.find({ _id: ObjectId(req.params.id) }).forEach(contato => contatos.push(contato));
    const contato = contatos[0];

    res.json({ contato });

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Criar um contato
exports.contatosCreate = async(req, res) => {

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const Contato = database.collection("Contato");

    const contato = req.body;
    await Contato.insertOne(req.body);

    res.status(201).json({ contato });

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Atualizar um contato
exports.contatosUpdate = async(req, res) => {

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const Contato = database.collection("Contato");

    await Contato.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });

    res.status(204).send();

  } catch(err) {
    res.send({ message: err.message });
  }
};

// Apagar um contato
exports.contatosDelete = async(req, res) => {

  try {

    await mongoClient.connect();
    const database = mongoClient.db(process.env.MONGO_DATABASE);
    const Contato = database.collection("Contato");

    await Contato.deleteOne({ _id: ObjectId(req.params.id) });

    res.status(204).send();

  } catch(err) {
    res.send({ message: err.message });
  }
};

