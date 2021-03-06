const yaml = require('js-yaml')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

const vars = Object.freeze({
    DiscordClientToken: process.env.APP_DISCORD_CLIENT_TOKEN || '',
    ResponsesYamlLocation: process.env.APP_RESPONSES_YAML_LOCATION || ''
})

checkEnv()
checkResponses()

client.once('ready', () => {
	  logger(`Discord bot is live. Logged in as ${client.user.tag}`)
})

client.login(vars.DiscordClientToken).then(() => {
    logger('Successfully logged in.')
}).catch(err => {
    logger('Failed to login')
    console.log({err})
})

client.on('message', handleMessage)

// search in message for a response message
function checkMessageForTriggerPhrase(message, responses) {
    var triggerWord
    Object.keys(responses).map(trigger => {
        var re = new RegExp(trigger, 'g')
        var found = re.exec(message)

        if (found && typeof triggerWord === 'undefined') {
            triggerWord = trigger
        }
    })
    return triggerWord
}

// parse messages as they come through
function handleMessage(msg) {
    var triggerWord
    var message = msg.content.toLowerCase()
    message = message.replace(/\n/g,'')
    var responses = getResponsesYAML()
    if (msg.member?.user.tag === client.user.tag) {
        return
    }
    triggerWord = checkMessageForTriggerPhrase(message, responses)
    if (typeof responses[triggerWord] === 'object') {
        msg.channel.send(randomPicker(responses[triggerWord]))
    } else if (typeof responses[triggerWord] === 'undefined') {
        return
    } else {
        msg.channel.send(responses[triggerWord])
    }
    logger(`[${msg.channel.guild.name}/${msg.channel.name}] ${msg.member.user.tag} triggered a response, with the word/pattern '${triggerWord}'`)
    return
}

// picks and item from an array randomly
function randomPicker(items) {
    return items[Math.floor(Math.random()*items.length)]
}

// logs with time and date
function logger(...msg) {
    var currentTimedate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    console.log(currentTimedate, ...msg)
}

// loads the responses yaml and returns it
function getResponsesYAML() {
    try {
        var doc = yaml.safeLoad(fs.readFileSync(vars.ResponsesYamlLocation, 'utf8'));
        return doc
    } catch (e) {
        console.log(e);
        return {}
    }
}

// checks environment for required values
function checkEnv() {
    var hasUndefinedKey = false
    Object.keys(vars).map(key => {
        if (vars[key].length === 0) {
            hasUndefinedKey = true
            console.log(`Error: environment variable '${key}' must be defined, check reference documentation for more info.`)
        }
    })
    if (hasUndefinedKey) {
        process.exit(0)
    }
}

// checks if responses exist
function checkResponses() {
    var responseFile = getResponsesYAML()
    if (typeof responseFile !== 'object' || typeof responseFile === 'undefined') {
        console.error(`please enter responses in '${vars.ResponsesYamlLocation}'`)
        process.exit(1)
    }
}
