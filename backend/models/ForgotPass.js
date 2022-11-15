const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPassSchema = new Schema({
  uuid: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  expiresBy: { type: Date },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
});

const ForgotPass = mongoose.model("ForgotPassword", forgotPassSchema);

module.exports = ForgotPass;
