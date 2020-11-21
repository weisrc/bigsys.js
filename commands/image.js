const userc = require("../userc");
const { MessageEmbed } = require("discord.js");

const keys = "score message identity_attack insult obscene severe_toxicity sexual_explicit threat toxicity".split(" ");

const sentimentMessage = (profile) => {
  let average = Math.round((profile.sentiment / profile.message) * 100) / 100;
  if (average < 0.2) return `With an average sentiment of **${average}** across messages. That person is not very kind and always unhappily complaining about something.`;
  if (average > 0.8) return `I love the charm and joy of that person. He is kind and very bright with an average sentiment of **${average}** across messages.`;
  return `I am not sure. That person seems rather neutral with an average sentiment of **${average}** across messages.`;
};

module.exports = async (message, args) => {
  let user = message.mentions.users.first() || message.author;
  let profile = await userc.find(user.id);
  if (!profile) return message.reply(`Sorry, I have no records of <@${user.id}>.`);
  message.reply(
    new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Image")
      .setAuthor(user.username, user.avatarURL())
      .setDescription("**Sentiment Analysis**\n" + sentimentMessage(profile))
      .addFields(keys.map((name) => ({ name, value: profile[name], inline: true })))
      .setTimestamp()
      .setFooter(`since ${profile.created.toDateString()}`)
  );
};
