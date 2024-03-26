const { Client, Intents } = require('discord.js');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
}); 

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {   
    if (msg.content === "ping") { 
        msg.reply("Pong");
        msg.channel.send(`Latency is ${Date.now() - msg.createdTimestamp}ms. API latency is ${Math.round(client.ws.ping)}ms.`);
    }
});

client.login(/* your token goes here */);
