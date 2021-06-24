const api = require('../util/api')

module.exports = {
  help: {
    signature: '',
    example: '',
    usage: 'List playable maps.'
  },
  execute: async msg => {
    let response = await api.get(`/map`)
    let maps = response.data
    msg.channel.send(`Maps: \`${maps.map(map => `${map.id} - ${map.name}`).join(', ')}\``)
  }
}