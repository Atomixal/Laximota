const { Client, Intents } = require('discord.js');
const { TOKEN } = require('./config.json')

/* IDEAS FOR THE BOT:

1) One word story, and when someone breaks the chain the story time ends and the bot compiles all the words that have been sent into a story in one message.

2) Maths questions with a leaderboard to get more people doing maths.

3) XP system because everyone has a fucking XP system.

4) A welcome message for anyone joining the server

5) A voting system, people can vote between 2 - 9 things and it keeps track of who's voted using reactions.

6) Credits :D

7) Music playing because everything has a fucking music player.

*/

class MathsQuestionGenerator {
    static amount = 0;
    static answers = 0;
    static questions = " ";
    constructor(inAmount) {
        MathsQuestionGenerator.amount = inAmount;
    }

    // Method to output maths questions
    static generateMathsQuestions() {
        for (let i = 0; i < MathsQuestionGenerator.amount; i++) {

            NextMathQuestion = Math.random() * (4 - 1) + 1;
            if (NextMathQuestion === 1) {
                this.MakeAdditionQuestions();
            }
        }
    }


    static randomNumberGenerator() {
        return Math.random() * (100 - 1) + 1;
    }

    static MakeAdditionQuestions() {
        for (let i = 0; i < MathsQuestionGenerator.amount; i++) {
            let randomNum1 = this.randomNumberGenerator();
            let randomNum2 = this.randomNumberGenerator();
            this.questions.push(`${randomNum1} + ${randomNum2}`);
            this.answers.push(randomNum1 + randomNum2);
        }
    }
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});


client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Register slash commands
    const commands = await client.application.commands.set([
        {
            name: 'ping',
            description: 'Returns the latency of the bot and the Discord API.'
        },
        {
            name: 'math_question',
            description: 'Returns a maths question.'
        }
    ]);
    console.log(`${commands.size} commands registered.`);
});

function RandomNumberGeneration() {
    return Math.round(Math.random() * (1, 100) + 1);
}

function RandomAdditionQuestion() {
    let rand1 = RandomNumberGeneration();
    let rand2 = RandomNumberGeneration();
    answers = rand1 + rand2

    return (`What is ${rand1} + ${rand2}?`);
}


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        interaction.reply(`Pong! Latency is ${Math.abs(Date.now() - interaction.createdTimestamp)}ms, and API latency is ${Math.round(client.ws.ping)}ms.`);
    }

    if (commandName === 'math_question') {
        interaction.reply(`${RandomAdditionQuestion()}`);
        client.on('message', async (response) => {
            const { ans } = response
            if (ans === answers) {
                response.reply(`Congratulations ${response.user.tag}! You're correct.`)
            }
            else {
                response.reply(`Sorry, ${response.user.tag}. You are incorrect. The correct answer was ${answers}.`)
            }
        });
    }
});

client.login(TOKEN);
