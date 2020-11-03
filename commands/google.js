const fetch = require("node-fetch");

module.exports = async (message, args) => {
  let res = await fetch("https://google-search3.p.rapidapi.com/api/v1/search/?q=hello", {
    headers: {
      "x-rapidapi-host": "google-search3.p.rapidapi.com",
      "x-rapidapi-key": "c232113298mshbc5484c7c6fce7dp1a7d18jsn57abf5e6ff1b",
      useQueryString: true,
    },
  });
  message.reply(JSON.stringify(res.data));
};
