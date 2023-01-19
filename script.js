/*
--- TESTE DE EXCLUSÃO DE CONTAS ---

const db = require('./config/db.config');
const User = db.user;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendMail} = require('./utils/sendMail');
const { Sequelize, sequelize } = require('./config/db.config');
const { Op } = require('sequelize');

let a = async (i) => {
    let user = null;
    const email = `josed${i}vid@gmail.com`;
    const body = {
        email,
        password: `${i}#321`,
        username: 'José'
    };
    try {
        user = await User.findOne({
        where: {
            email
        }
        });
    } catch(err) {
        res.json({ message: err.message} );
    }
    
    if (user != null) {
        return console.log({ message: 'E-mail já cadastrado.'} );
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const newUser = Object.assign({}, body);
    newUser.password = hashedPassword;
    
    const expiresIn = process.env.CLEAN_TIME * 1;
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {expiresIn});
    //newUser.token = token;
    
    try {
        user = await User.create(newUser);
        
        await sendMail(email, token);
        //deleteUser(expiresIn * 1000, user.id);
    
        console.log({ usuario: user.id });
b();
    } catch(err) {
        console.log({ message: err.message} );
    }
    
}
a(4);

var b = async () => {
    try {
        const date = new Date(new Date() - 1000 * process.env.CLEAN_TIME);
        console.log(date <= new Date(), date, new Date());
        const deleted = await User.destroy({
          where: {
              confirmed: false,
              createdAt: {
                  [Op.lte]: date
              }
          }
        });
        console.log({ deleted });
      } catch(err) {
        console.log({ message: err.message });
      }
    
}
*/