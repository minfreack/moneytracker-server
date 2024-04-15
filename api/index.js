const dotenv = require('dotenv')
const express =  require('express');
const cors = require('cors');
const http = require('http');
import { Server } from 'ws';
const routes = require('./routes');
const { getLastTransactions, newTransaction, getTransactions } = require('./components/cashflow/controller');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
dotenv.config()

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

export default (req, res) => {
  const wss = new Server({ noServer: true });

  wss.on('connection', async(socket) => {
    const id = socket.handshake.query['id']
    socket.join(id)
    const res = await getLastTransactions(id)
    if(res?.data?.success){
      wss.to(id)?.emit('cashflow', {data: res?.data?.data})
    }
    socket.on('new-transaction', async(data) => {
      const res = await newTransaction(data)
      if(res?.data?.success){
        const res = await getLastTransactions(data?.userID)
        if(res?.data?.success){
          wss.to(id)?.emit('cashflow', {data: res?.data?.data})
        }
        const res2 = await getTransactions(data?.userID)
        if(res2?.data?.success){
          wss.to(id)?.emit('all-transactions', {data: res2?.data?.data})
        }
      }
    })

    socket.on('all-transactions', async(data) => {
      const res = await getTransactions(data?.userID)
      if(res?.data?.success){
        wss.to(id)?.emit('all-transactions', {data: res?.data?.data})
      }})
  });
};

routes(app)

server.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});

module.exports = app