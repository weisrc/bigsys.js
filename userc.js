const mongoose = require("mongoose");
const { increments } = require("./config");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    id: String,
    score: { type: Number, default: 0 },
    sentiment: { type: Number, default: 0 },
    message: { type: Number, default: 0 },
    identity_attack: { type: Number, default: 0 },
    insult: { type: Number, default: 0 },
    obscene: { type: Number, default: 0 },
    severe_toxicity: { type: Number, default: 0 },
    sexual_explicit: { type: Number, default: 0 },
    threat: { type: Number, default: 0 },
    toxicity: { type: Number, default: 0 },
    created: Date,
  })
);

const create = async (id) => {
  if (await find(id)) throw "user-exists";
  return await User.create({
    id,
    created: new Date(),
  });
};

const find = (id) => User.findOne({ id });

const update = (id, score, n_messages, n_warnings) => {
  let updates = {};
  if (!isNaN(score)) updates.score = score;
  if (!isNaN(n_messages)) updates.n_messages = n_messages;
  if (!isNaN(n_warnings)) updates.n_warnings = n_warnings;
  User.updateOne({ id }, updates);
};

const inc = (id, labels, sentiment) => {
  let $inc = { message: 1, score: increments.message, sentiment: sentiment - 0.5 };
  for (let label of labels) {
    $inc[label] = 1;
    $inc.score += increments[label];
  }
  console.log($inc);
  return User.updateOne({ id }, { $inc });
};

const note = async (id, labels, sentiment) => {
  if (!(await find(id))) await create(id);
  return await inc(id, labels, sentiment);
};

module.exports = {
  create,
  find,
  update,
  inc,
  note,
  User,
};
