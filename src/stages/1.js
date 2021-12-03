const banco = require('../banco')

function execute(user, msg, appointmentId = null) {
  banco.db[user].stage = 2
  return [
    "Sua resposta já foi enviada!",
  ]
}

exports.execute = execute;