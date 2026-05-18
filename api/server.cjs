const jsonServer = require('json-server');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

console.log('db path:', dbPath);
console.log('dirname:', __dirname);

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;