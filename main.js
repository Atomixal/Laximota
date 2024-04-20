const { Client, GatewayIntentBits, CachedManager, ModalBuilder } = require('discord.js');
const { TOKEN } = require('./config.json');
const { SlashCommandBuilder, messageLink } = require('@discordjs/builders');

function randomIntFromInterval(lowerBound, upperBound) {
    return Math.floor(Math.random() * (upperBound - lowerBound + 1) + min);
}   

function CollectionFilter(response, correctAnswer) {
    return !response.author.bot && parseInt(response.content) === correctAnswer; 
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});


// Slash commands
client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const ping = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the latency of the bot and the Discord API.');
    const credits = new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Returns the credits for everyone who contributed to it.');
    const addition_question = new SlashCommandBuilder()
        .setName('addition_question')
        .setDescription('Returns an addition question.')
    const subtraction_question = new SlashCommandBuilder()
        .setName('subtraction_question')
        .setDescription('Returns a subtraction question.')
});


/* Make lots of maths questions of different types, that's what this bot will do now. Start with the simple one and go up to like basic calc. */

const scores = {};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        interaction.reply(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms, and API latency is ${Math.round(client.ws.ping)}ms.`);
    }

    if (commandName === 'addition_question') {
        let num1 = randomIntFromInterval(1, 100)
        let num2 = randomIntFromInterval(1, 100)
    
        let correctAnswer = num1 + num2;
    
        interaction.reply(`What is ${num1} + ${num2}?`)
            .then(() => {
                // Await a single response from the user
                interaction.channel.awaitMessages({ filter: CollectionFilter(response, correctAnswer), max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        interaction.channel.send(`${collected.first().author} got the correct answer!`);
                        scores[collected.first().author.id] = (scores[collected.first().author.id] || 0) + 1;

                        let scoresArray = Object.entries(scores);
                        
                        scoresArray.sort((a, b) => b[1] - a[1]);

                        let [userId, userScore] = scoresArray[0];

                        interaction.channel.send(`<@${userId}> is in the lead with ${userScore} point(s)!`);    
                    })
                    .catch(() => {
                        interaction.followUp(`Looks like nobody got the answer this time. The correct answer was ${correctAnswer}`);
                    }); 
            });
    }

    if (commandName === 'subtraction_question') {
        let num1 = randomIntFromInterval(1, 100)
        let num2 = randomIntFromInterval(1, 100)
        
        let correctAnswer = num1 - num2

        interaction.reply(`What is ${num1} - ${num2}`)
            .then(() => {
                interaction.channel.awaitMessages({ filter: CollectionFilter(response, correctAnswer), max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        interaction.channel.send(`${collected.first().author} got the correct answer!`);
                        scores[collected.first().author.id] = (scores[collected.first().author.id] || 0) + 1;

                        scoresArray = Object.entries(scores);
                        
                        scoresArray.sort((a, b) => b[1] - a[1]);

                        [userId, userScore] = scoresArray[0];

                        interaction.channel.send(`<@${userId}> is in the lead with ${userScore} point(s)!`);    
                    })
                    .catch(() => {
                        interaction.followUp(`Looks like nobody got the answer this time. The correct answer was ${correctAnswer}`);
                    }); 
            })
    }
    
    if (commandName === 'credits') { 
        interaction.reply('Made by <@584844292137418763> using Discord.js. Thank you for using Laximota <3.');
    }

});

 
client.login(TOKEN);
    
