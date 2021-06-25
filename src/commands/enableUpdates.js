const api = require('../util/api')

module.exports = {
  help: {
    signature: '',
    example: '',
    usage: 'Have the bot message you when one of your matches starts, ends, or progresses a turn.'
  },
  execute: async msg => {
    try {
      await api.post('/player/register-webhook', {
        on_behalf_of: msg.author,
        url: process.env.THIS_URL
      })
      return msg.channel.send('Done, I will message you when one of your matches starts, ends, or progresses a turn.')
    } catch(error) {
      if(error.response && error.response.status == 409)
        return msg.channel.send('You already had updates enabled!')
      else
        throw error
    }
  }
}