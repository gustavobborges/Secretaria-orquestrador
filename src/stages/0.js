const banco = require('../banco')
const axios = require('axios');

function execute(user, msg, appointmentId = null) {
    if (msg === "1") {
      banco.db[user].stage = 1;
      const date = new Date();
      const payload  = {
        response: "Confirmado",
        date,
      }

      const sendResponse = axios.post(`http://localhost:8000/appointment/messageResponse/${appointmentId}`, payload).then((response) => {
          return response.data;
      });
      console.log('sendResponse: ', sendResponse);

      return [
          "Consulta confirmada!"
      ]
    }

    if (msg === "2") {
      banco.db[user].stage = 1;
      const date = new Date();
      const payload  = {
        response: "Desmarcado",
        date,
      }

      const sendResponse = axios.post(`http://localhost:8000/appointment/messageResponse/${appointmentId}`, payload).then((response) => {
          return response.data;
      });
      console.log('sendResponse: ', sendResponse);
        return [
          "Tudo bem. Consulta desmarcada!"
        ]
    }
    
      return [
        "Desculpe, não entendi 😥\n----------------------------------------\nPara confirmar a consulta, digite *1*;\nPara desmarcar, digite *2*",
      ]
}

exports.execute = execute;