// Definição dos esquemas a serem usados pela documentação Swagger.
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuario.
 *           example: paulo@email.com
 *         password:
 *           type: string
 *           description: Senha de acesso do usuario.
 *           example: asdf
 *     NewUser:
 *       allOf:
 *         - $ref: '#/components/schemas/LoginUser'
 *         - type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Nome do usuario.
 *               example: Paulo#1
 *             isAdmin:
 *               type: boolean
 *               description: Especifica premissoes do usuario.
 *               example: false
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/NewUser'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do usuario.
 *               example: 0
 *             createdAt:
 *               type: string
 *               description: Data no formato ISO em que o usuario foi registrado.
 *               example: 2021-07-08T18:08:19.965Z
 *             updatedAt:
 *               type: string
 *               description: >
 *                 Data no formato ISO em que o usuario foi atualizado pela última vez.
 *               example: 2021-07-08T18:08:19.965Z
 *             confirmed:
 *               type: boolean
 *               description: Status de confirmacao do usuario.
 *               example: true
 */

const express = require('express');
const router = express.Router();
const verify = require('../utils/verifyToken');
const checkPermission = require('../utils/verifyPermission');

// Importa o controller
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Usuario criado
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   type: integer
*/
router.post('/register', userController.userCreate);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       201:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 token:
 *                   type: string
*/
router.post('/login', userController.userLogin);

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Confirma um usuario.
 *     description: Confirma a conta de um usuario, recuperado pelo token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmacao envidado por e-mail, ao usuario.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario confirmado.
*/
router.get('/verify/:token', userController.userVerify);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Recupera um único usuario.
 *     description: Recupera um único usuario da agenda pelo ID. Pode ser usado sem autenticação.
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do usuario a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Um único usuario.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuario:
 *                   $ref: '#/components/schemas/User'
*/
router.get('/:id', verify, checkPermission, userController.userRead);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Recupera a lista de usuarios.
 *     description: Recupera a lista de usuarios do banco.
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Uma lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
*/
router.get('/', verify, checkPermission, userController.userList);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualiza um usuario.
 *     description: Modifica os valores de um usuario já armazenado na agenda, recuperado pelo ID.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do usuario a ser recuperado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario atualizado.
*/
router.patch('/:id', verify, checkPermission, userController.userUpdate);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Apaga um usuario.
 *     parameters:
 *       - in: header
 *         name: Auth-Token
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do usuario a ser eliminado.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario apagado.
*/
router.delete('/:id', verify, checkPermission, userController.userDelete);

module.exports = router;
