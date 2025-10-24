import express from 'express';
const app = express();
const port = 3130;
import {clients} from './Clients.js';

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
//endpoint para consultar cuenta por id
app.get('/cuenta/:idClient', (req, res) => {
  const {idClient}= req.params;
  const client = clients.find(b=> b._id === idClient)
  const response = {
    finded: Boolean(client),
    account: client || 'Cliente no encontrado'
  }
  res.send(response);
});
//endpoint para verificar que parametros manda
app.get('/cuentas', (req, res) => {
  const {_id, client, gender} = req.query;

  //mostrar todos los clientes sino manda parametros
  if (!_id && !client && !gender) {
    return res.send({
    count: clients.length,
    data: clients
    });
  }
  const FindedClients = clients.filter(xClient =>{
    return(
      (!_id || xClient._id === _id) &&
      (!client || xClient.client === client) &&
      (!gender || xClient.gender === gender)
    );
  });

  let response = {};

  if(FindedClients.length === 1){
    response = {
      finded: true,
      account: FindedClients || 'Cliente no encontrado'
      };
    }else if (FindedClients.length > 1){
      response = {
        finded: true,
        data: FindedClients
      };
    }else{
      response = {
        finded: false,
        data: 'Cliente no encontrado'
      }
    }
  
    res.send(response);
});
//endpoint para consultar el balance de cuentas
app.get('/cuentasBalance', (req, res) => {
  const FindedClients = clients.filter(client => {
    return(client.isActive === true)
  });

  let total = 0;
  let Finded;
  
  for (const client of FindedClients) {
    const money = parseFloat(client.balance.replace('$', '').replace(/,/g, ''))
    total += money;
  }

  if(FindedClients.length > 0){
    Finded = true;
  }else{
    Finded = false
  }

  const response = {
    status: Finded,
    accountBalance: `$${total}`
  }
  res.send(response);
});