const axios = require('./axios')

module.exports = async (id) => {
  let player = await axios.get(`/player/${id}`).then(r => r.data)
  if(player.discord_notifications)
    return await client.users.fetch(player.discord_id)
  else
    return player.username
}