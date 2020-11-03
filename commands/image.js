const userc = require("../userc");

module.exports = async (message, args) => {
  let user = message.mentions.users.first() || message.author;
  let profile = await userc.find(user.id);
  if (!profile) message.reply("Sorry, I do not know the user you speak of...");
  message.reply(JSON.stringify(profile));
};
