const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = model("Token", TokenSchema);
