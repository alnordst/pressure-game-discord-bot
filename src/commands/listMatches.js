const api = require('../util/api')

module.exports = {
  help: {
    signature: '',
    example: '',
    usage: 'List all matches.'
  },
  execute: async msg => {
    let response = await api.get(`/match`)
    let matches = response.data
    msg.channel.send(`Matches: \`${matches.map(match => match.id).join(', ')}\``)
  }
}