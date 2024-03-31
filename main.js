const { Client, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { QuickDB } = require('quick.db');

const db = new QuickDB();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const scores = {};

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    const pingCommand = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the latency of the bot and the Discord API.');

    const creditsCommand = new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Returns the credits for everyone who contributed to it.');

    const mathQuestionCommand = new SlashCommandBuilder()
        .setName('math_question')
        .setDescription('Returns a math question.');

    const messageCountCommand = new SlashCommandBuilder()
        .setName('message_count')
        .setDescription('Outputs a list of who has the most messages sent in the server.');
    
    const commands = [pingCommand, creditsCommand, mathQuestionCommand, messageCountCommand];
    
    client.guilds.cache.forEach(guild => {
        guild.commands.set(commands);
    });
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
                    return !response.author.bot && parseInt(response.content) === correctAnswer; 
                };
    
                // Await a single response from the user
                interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        scores[collected.first().author.id] = (scores[collected.first().author.id] || 0) + 1;

                        let scoresArray = Object.entries(scores);
                        
                        scoresArray.sort((a, b) => b[1] - a[1]);

                        let [userId, userScore] = scoresArray[0];  
                        interaction.channel.send(`${collected.first().author} got the correct answer!\n`);
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

    if (commandName === 'message_count') {
        // Message count logic
    }
});

client.on("messageCreate", async (message) => {
    // Message counting and XP system logic
});

client.login(TOKEN);
