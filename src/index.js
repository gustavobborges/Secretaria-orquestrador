const express = require('express');
const venom = require('venom-bot');
const cors = require("cors");
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());
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
    if (message.body) {
      client
        .sendText(message.from, 'Olá, sou a Secretária!')
        .then((result) => {
          console.log('Result: ', result);
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro);
        });
    }
  });

  app.route("/sendMessage")
		.post(function (req, res) {
			try {
        console.log(req.body);
				const phone = '55' + req.body.phone + '@c.us';
				const messageText = req.body.messageText;
				client.sendText(phone, messageText);
				// const phoneInput = messageSended.me.wid.user;
        console.log('telefone')
				res.json({
          messageSended: 'enviado!',
          // origin: phoneInput
        });
			} catch (err) {
				return res.status(400).json({ error: 'Houve algum problema durante a requisição' })
			}
		});
}
