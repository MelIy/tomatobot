"use strict";

const request = require("request-promise");
const Eris = require("eris");
const config = require("./config.json");
const Command = require("./command");

// Using basic commands
const bot = new Eris.CommandClient(config.token, {}, {
    name: "Tomato",
    prefix: "nico.",
    description: "Nani sore, Imi Wakanai"
});

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

// Trick or Treat Event Game
// Getting Nico is a Treat and will provide a role
const TRICK_ROLE_ID = config.role_ids[0];
const TREAT_ROLE_ID = config.role_ids[1];
const GUILD_ID = config.guild_id;
const IDOL = "Yazawa Nico";
const HALLOWEEN_CARDS = "http://schoolido.lu/api/cards?translated_collection=Halloween&page_size=50";
const COMMAND = "NicoNii";

const command = new Command(bot);

bot.on("messageCreate", (msg) => { // When a message is created

    if(!config.channel_ids.includes(msg.channel.id)) {
        return;
    }

    if(msg.attachments && msg.attachments.length > 0 && msg.channel.id === config.channel_ids[1]) {
        return bot.addGuildMemberRole(GUILD_ID, msg.author.id, TREAT_ROLE_ID, "Holiday Event - Treat!!!");
    }

    if(msg.content.toLowerCase().search(COMMAND.toLowerCase()) >= 0 && msg.channel.id === config.channel_ids[0]) {

        request.get(HALLOWEEN_CARDS)
            .then(data => {
                const cards = JSON.parse(data).results;

                // GET nico
                if(randomIntFromInterval(0,cards.length) === 0) {
                    return bot.createMessage(msg.channel.id,
                        "🍬 🍫 🍬 🍫 🍬 🍫 \n" +
                        "🍫 🍬 ***TREAT!!!*** 🍬 🍫 \n" +
                        "🍬 🍫 🍬 🍫 🍬 🍫 \n" +
                        msg.author.mention + " have received the TRICKED!!! role \n" +
                        (Math.random() >= 0.5 ? "http://i.schoolido.lu/c/909idolizedNico.png\n" : "http://i.schoolido.lu/c/425idolizedNico.png\n")
                        )
                        // Add Them to a role
                        .then(() => bot.addGuildMemberRole(GUILD_ID, msg.author.id, TRICK_ROLE_ID, "Holiday Event - Tricked!!!"))

                } else {
                    const filteredCards = cards.filter(card => card.idol.name !== IDOL);

                    const card = filteredCards[randomIntFromInterval(0,filteredCards.length)];
                    return bot.createMessage(msg.channel.id,
                        "👻 🎃 👻 🎃 👻 🎃 👻 \n" +
                        "🎃 🎃 ***TRICKED!!!*** 🎃 🎃 \n" +
                        "🎃 👻 🎃 👻 🎃 👻 🎃 \n" +
                        "http:" + card.card_idolized_image + "\n");
                }
            })
            .catch((err) => {
                console.log(err,"error");
                return bot.createMessage(msg.channel.id, "Please try again later")
            })

    }

});

bot.connect(); // Get the bot to connect to Discord

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min)+min);
}