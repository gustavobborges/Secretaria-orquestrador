const express = require('express');
const venom = require('venom-bot');
const cors = require("cors");
// const puppeteer = require('puppeteer');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(8080);

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
	app.use(cors());
	next();
});


venom
  .create({
    session: 'secretary-bot', //name of session
    multidevice: false, // for version not multidevice use false.(default: true)
    useChrome: false,
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });

  app.route("/sendMessage")
		.post(function (req, res) {
			try {
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
