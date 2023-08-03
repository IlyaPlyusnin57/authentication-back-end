const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Post", PostSchema);
