require("dotenv").config();
require("@tensorflow/tfjs");
const mongoose = require("mongoose");
const toxicity = require("@tensorflow-models/toxicity");
const qna = require("@tensorflow-models/qna");
const sentiment = require("./models/sentiment");
const Discord = require("discord.js");
const logger = require("./logger");
const commands = require("./commands");
const userc = require("./userc");

const prefix = "sys-";
const threshold = 0.7;
const client = new Discord.Client();
// client.context = [];

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    let args = message.content.slice(prefix.length).split(" ");
    let name = args.shift();
    if (commands[name]) return commands[name](message, args);
    message.reply("invalid command: " + name);
  } else {
    // client.context.push(`${message.author.username} said "${message.content}".`);
    client.toxicity.classify([message.content]).then((Y) => {
      let flags = Y.filter((flag) => flag.results[0].match).map((flag) => flag.label);
      let sentiment = client.sentiment.predict(message.content);
      console.log(sentiment);
      userc.note(message.author.id, flags, sentiment);
      if (flags.length == 0) return;
      message.reply(`Wow, calm down... ` + flags.join());
    });
  }
});

const main = async () => {
  client.toxicity = await toxicity.load(threshold);
  console.clear();
  logger.success("tensorflow text-toxicity-classifier model loaded...");
  client.sentiment = await sentiment();
  logger.success("tensorflow sentiment prediction model loaded...");
  // client.qna = await qna.load();
  // logger.success("tensorflow qna model loaded...");
  await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  logger.success("mongodb connected to database...");
  await client.login(process.env.TOKEN);
  logger.success(`discord client connected as ${client.user.tag}...`);
};
main();
