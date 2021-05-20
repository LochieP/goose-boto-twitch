import tmi from 'tmi.js'

//Import values from other values
import { BOT_USERNAME , OAUTH_TOKEN, CHANNEL_NAME } from './constants'
import { BLOCKED_WORDS } from './blocked'

//Grab functions declared in other files
const eventHandlers = require("./eventHandlers.js");
const commands = require("./commands.js");

const options = {
	options: { debug: true },
	connection: {
    reconnect: true,
    secure: true,
    timeout: 180000,
    reconnectDecay: 1.4,
    reconnectInterval: 1000,
	},
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options)

client.connect()

//General events
client.on('disconnected', (reason) => {
  eventHandlers.onDisconnectedHandler(reason)
})

client.on('connected', (address, port) => {
  eventHandlers.onConnectedHandler(address, port)
})

client.on('hosted', (channel, username, viewers, autohost) => {
  eventHandlers.onHostedHandler(channel, username, viewers, autohost)
})

client.on('subscription', (channel, username, method, message, userstate) => {
  eventHandlers.onSubscriptionHandler(channel, username, method, message, userstate)
})

client.on('raided', (channel, username, viewers) => {
  eventHandlers.onRaidedHandler(channel, username, viewers)
})

client.on('cheer', (channel, userstate, message) => {
  eventHandlers.onCheerHandler(channel, userstate, message)
})

client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
  eventHandlers.onGiftPaidUpgradeHandler(channel, username, sender, userstate)
})

client.on('hosting', (channel, target, viewers) => {
  eventHandlers.onHostingHandler(channel, target, viewers)
})

client.on('reconnect', () => {
  eventHandlers.reconnectHandler()
})

client.on('resub', (channel, username, months, message, userstate, methods) => {
  eventHandlers.resubHandler(channel, username, months, message, userstate, methods)
})

client.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
  eventHandlers.subGiftHandler(channel, username, streakMonths, recipient, methods, userstate)
})

//Leave onMessage handler here to ensure filtering of words

function onMessageHandler (channel, userstate, message, self) {
  checkTwitchChat(userstate, message, channel)
}

//Event handling section

client.on('message', (channel, userstate, message, self) => {
  if(self) {
    return
  }

  //Make it so bot messages aren't checked
  if (userstate.username === BOT_USERNAME) {
    console.log(`Not checking bot's messages.`)
    return
  }

  //bamboozle
  if (userstate.username === 'Goomerz') {
    client.say(channel, `@${userstate.username}, S`)
    client.say(channel, `@${userstate.username}, H`)
    client.say(channel, `@${userstate.username}, E`)
    client.say(channel, `@${userstate.username}, E`)
    client.say(channel, `@${userstate.username}, E`)
    client.say(channel, `@${userstate.username}, S`)
    client.say(channel, `@${userstate.username}, H`)
    return
  }

  //REGION: MESSAGE CATCHER

	if(message.toLowerCase() === '!hello') {
    commands.hello(channel, userstate)
    return
  }

  if(message.toLowerCase() === '!youtube') {
    commands.youtube(channel, userstate)
    return
  }

  if(message.toLowerCase() === '!setup') {
    commands.setup(channel, userstate)
    return
  }

  //ENDREGION: MESSAGE CATCHER

  //onMessageHandler will handle the primary message filtering for blocked words
  onMessageHandler(channel, userstate, message, self)
})

//Interactive functions / commands

function checkTwitchChat(userstate, message, channel) {
  console.log(message)
  message = message.toLowerCase()
  let shouldSendMessage = false
  shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
  if (shouldSendMessage) {
    //Tell user
    client.say(channel, `@${userstate.username}, yoooooooooooooooooooooooooo none of that`)
    //Delete message
    client.deletemessage(channel, userstate.id)
  }

  //length checker
  if(message.length() > 500){
        //Tell user
        client.say(channel, `@${userstate.username}, please don't send messages that are massive!`)
        //Delete message
        client.deletemessage(channel, userstate.id)
  }
}
