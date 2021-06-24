const knex = require('knex')({
  client: 'pg',
  connection: {
    host : 'alnordst.tplinkdns.com',
    user : 'postgres',
    password : 'PrcpSrj3',//process.env.DB_PASSWORD,
    database : 'discord'
  }
})

let getPlayerData = discordId => {
  return knex('players').where({ discord_id: discordId.toString() })
}

let getOrCreatePlayerData = async discordId => {
  let data = await getPlayerData(discordId)
  if(data) {
    return data
  } else {
    await knex('players').insert({ discord_id: discordId.toString() })
    return getPlayerData(discordId)
  }
}

let setPlayerData = (discordId, payload) => {
  delete payload.discord_id
  return knex('players').where({ discord_id: discordId }).update(payload)
}

module.exports = {
  getPlayerData,
  getOrCreatePlayerData,
  setPlayerData
}
