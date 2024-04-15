const { Client, Intents, CachedManager } = require('discord.js');
const { TOKEN } = require('./config.json');
const { SlashCommandBuilder, messageLink } = require('@discordjs/builders');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
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
    const math_question = new SlashCommandBuilder()
        .setName('math_question')
        .setDescription('Returns a math question.');
    const message_count = new SlashCommandBuilder()
        .setName('message_count')
        .setDescription('Outputs a list of who has the most messages sent in the server,');
});

const scores = {};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        interaction.reply(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms, and API latency is ${Math.round(client.ws.ping)}ms.`);
    }

    if (commandName === 'math_question') {
        let num1 = Math.floor(Math.random() * 100) + 1; 
        let num2 = Math.floor(Math.random() * 100) + 1; 
    
        let correctAnswer = num1 + num2;
    
        interaction.reply(`What is ${num1} + ${num2}?`)
            .then(() => {
                const collectorFilter = response => {
                    return !response.author.bot && parseInt(response.content) === correctAnswer; 
                };
    
                // Await a single response from the user
                interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
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
    
    if (commandName === 'credits') { 
        interaction.reply('Made by <@584844292137418763> using Discord.js. Thank you for using Laximota <3.');
    }

});


client.on("messageCreate", async(message) => { // Message counting system, will update to have some sort of xp system.
    const authorId = message.author.id;
    db.add(`messageCount_${message.author.id}`, 1);
})
 
client.login(TOKEN);
    
