const PAD_INDEX = 0; // Index of the padding character.
const OOV_INDEX = 2; // Index fo the OOV character.

function padSequences(sequences, maxLen, padding = "pre", truncating = "pre", value = PAD_INDEX) {
  return sequences.map((seq) => {
    if (seq.length > maxLen)
      if (truncating === "pre") seq.splice(0, seq.length - maxLen);
      else seq.splice(maxLen, seq.length - maxLen);
    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; ++i) pad.push(value);
      if (padding === "pre") seq = pad.concat(seq);
      else seq = seq.concat(pad);
    }
    return seq;
  });
}

module.exports = {
  PAD_INDEX,
  OOV_INDEX,
  padSequences,
};
