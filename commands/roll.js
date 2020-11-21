const { MessageEmbed } = require("discord.js");

module.exports = async (message, args) => {
  let match = /^(\d+)?d(\d+)([+-]\d+)?$/.exec(args[0]);
  if (!match) return message.reply("Invalid dice notation...");
  let count = typeof match[1] == "undefined" ? 1 : parseInt(match[1]);
  let size = parseInt(match[2]);
  let modifier = typeof match[3] == "undefined" ? 0 : parseInt(match[3]);
  let rolls = [];
  if (count > 100) return message.reply("Too many dices...");
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * size) + 1);
  rolls = rolls.sort();
  message.reply(
    new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Dice Roll results for " + args[0])
      .addFields([
        { name: "Rolls", value: rolls.join(", ") },
        { name: `Sum + ${modifier}`, inline: true, value: rolls.reduce((acc, cur) => acc + cur, 0) + modifier },
      ])
      .setTimestamp()
      .setFooter(`Bigsys is watching you.`)
  );
};
