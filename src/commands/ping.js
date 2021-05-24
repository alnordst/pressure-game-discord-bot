const axios = require('../util/axios')

module.exports = async msg => {
  let response = `I'm awake! `
  try {
    await axios.get('/players')
    response += 'The api is up too.'
  } catch(err) {
    console.log(err)
    response += 'The api is down though'
  }
  return msg.reply(response)
}