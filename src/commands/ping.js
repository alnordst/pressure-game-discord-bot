const api = require('../util/api')

module.exports = {
  execute: async (msg) => {
    try {
      await api.get('/')
      msg.channel.send(`I'm up and the API is too.`)
    } catch(error) {
      msg.channel.send(`I'm up but the API is down.`)
    }
  }
}