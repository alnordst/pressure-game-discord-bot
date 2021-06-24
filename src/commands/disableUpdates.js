const api = require('../util/api')

module.exports = {
  help: {
    signature: '',
    example: '',
    usage: 'If updates are disabled, the bot will only message you in direct response to your commands.'
  },
  execute: async msg => {
    let webhooks = await api.post('player/list-webhooks', {
      on_behalf_of: msg.author
    })
    let webhook = webhooks.find(it => it.url == process.env.THIS_URL)
    if(webhook) {
      await api.post('player/remove-webhook', {
        on_behalf_of: msg.author,
        id: webhook.id
      })
      return msg.channel.send('Done, I will only message you in direct response to your commands.')
    } else {
      return msg.channel.send('You already had updates disabled!')
    }
  }
}