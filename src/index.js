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
    const messageFrom = message.from;
    const db = Object.entries(banco.db);
    const clientSession = db.map((session) => {
      const sessionValue = session[0]?.substring(5);
      const messageFromValue = messageFrom?.substring(4);
      if (sessionValue === messageFromValue) {
        return session[1];
      }
    });
    if (message.body) { 
      let resp = stages.step[getStage(message.from)].obj.execute(message.from, message.body, clientSession[0]?.appointmentId || '');
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
				const phone = '55' + req.body.phone + '@c.us';
				const messageText = req.body.messageText;
        const appointmentId = req.body.appointmentId;
				client.sendText(phone, messageText);
        getStage(phone, appointmentId);

				res.json({
          messageSended: 'enviado!',
        });
			} catch (err) {
				return res.status(400).json({ error: 'Houve algum problema durante a requisição' })
			}
		});
}

function getStage(user, appointmentId = null) {
  if (banco.db[user]) {
    return banco.db[user].stage
  }
  
  else {
    banco.db[user] = {
      stage: 0,
      appointmentId,
    }
  }

  return banco.db[user].stage;
}