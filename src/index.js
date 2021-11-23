const venom = require('venom-bot');
const puppeteer = require('puppeteer');

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

async function start(client) {
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
}
//
// app.listen(3333);
