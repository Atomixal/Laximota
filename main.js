const { Client, Intents } = require('discord.js');
const { TOKEN } = require('./config.json')
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

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
});

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
                    return !response.author.bot && parseInt(response.content) === correctAnswer; // Checks if the response is NOT from the bot and equal to the correct answer
                };
    
                // Await a single response from the user
                interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        interaction.followUp(`${collected.first().author} got the correct answer!`);
                    })
                    .catch(() => {
                        interaction.followUp(`Looks like nobody got the answer this time. The correct answer was ${correctAnswer}`);
                    });
            });
    }
    

    if (commandName === 'credits') { 
        interaction.reply('Made by <@584844292137418763> using Discord.js. Thank you for using Laximota <3');
    }
});
 
client.login(TOKEN);
 
