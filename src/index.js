const express = require('express');
const venom = require('venom-bot');
const bodyParser = require('body-parser');
const banco = require("./banco");
const stages = require("./stages");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(8080);

venom
  .create({
    session: 'secretary-bot',
    useChrome: false,
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

  client.onMessage((message) => {
    console.log('banco.db', banco.db);

    const messageFrom = message.from;
    const db = Object.entries(banco.db);
    const clientSession = db.map((session) => {
      const sessionValue = session[0];
      const messageFromValue = messageFrom;
      console.log('sessionValue', sessionValue); 
      console.log('messageFromValue', messageFromValue); 
      if (sessionValue === messageFromValue) {
        return session[1];
      }
    });
    const stage = getStage(message.from)
    console.log('stage', stage);
    if (message.body && stage < 2) { 
      let resp = stages.step[stage].obj.execute(message.from, message.body, clientSession[0]?.appointmentId || '');
      if (!clientSession.finished) {
        for (let index = 0; index < resp.length; index++) {
          const element = resp[index];
          client.sendText(message.from, element);
        }
      }
    }
  });

  app.route("/sendMessage")
		.post(function (req, res) {      
			try {
        console.log(req.body);
				const phone = '55' + req.body.phone.replace('9', '') + '@c.us';
				const messageText = req.body.messageText;
        const appointmentId = req.body.appointmentId;
				client.sendText(phone, messageText);
        getStage(phone, appointmentId, true);
        console.log('banco.db', banco.db);
				res.json({
          messageSended: 'enviado!',
        });
			} catch (err) {
				return res.status(400).json({ error: 'Houve algum problema durante a requisição' })
			}
		});
}

function getStage(user, appointmentId = null, reset = null) {
  if (banco.db[user] && !reset) {
    return banco.db[user].stage
  }

  if (!banco.db[user] || reset) {
    banco.db[user] = {
      stage: 0,
      appointmentId,
    }
  }

  return banco.db[user].stage;
}