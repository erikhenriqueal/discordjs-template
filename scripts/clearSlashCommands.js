const { config: _envConfig } = require('dotenv')
const { resolve } = require('path')
const { existsSync } = require('fs')
const isProduction = process.env.NODE_ENV === 'production'
const dynamicEnvFile = resolve(process.cwd(), isProduction ? './.env.production' : './.env.development')
const envFile = existsSync(dynamicEnvFile) ? dynamicEnvFile : resolve(process.cwd(), './.env')
if (!existsSync(envFile)) throw new Error('Can\'t find .env file')
_envConfig({ path: existsSync(envFile) ? envFile : '.env' })



const { Client } = require('discord.js')

const client = new Client({ intents: [ 'Guilds' ]})

client.once('ready', async client => {
  await client.application.commands.set([])
  .then(() => {
    console.log(`Cleared commands from '${client.user.username}'`)
  })
  await client.destroy()
})

client.login(process.env['BOT_TOKEN'])