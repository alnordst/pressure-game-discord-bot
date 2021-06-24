const api = require('../util/api')
const { matchReport } = require('../util/reports')
const render = require('../util/render')

module.exports = {
  help: {
    signature: '',
    example: '',
    usage: `Find a match.`
  },
  execute: async (msg) => {
    try {
      let response = await api.post('/match/find-match', { on_behalf_of: msg.author })
      let match = response.data
      if(response.status == 201) {
        return render(msg.channel, {
          text: `Game found!\n${matchReport(match)}`,
          board: JSON.parse(match.last_state.data)
        })
      } else if(response.status == 202) {
        msg.channel.send('No match found, new challenge issued and awaiting opponent.')
      }
    } catch(error) {
      if(error.response && error.response.status == 409) {
        msg.channel.send('You already have a challenge active!')
      } else {
        throw error
      }
    }
  }
}