const axios = require('axios')

module.exports = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    authorization: `Bot ${process.env.TOKEN}`
  }
})