const mongoose = require('mongoose');

const resetPasswordSchema = mongoose.Schema({
  userId: { type: String, require: true },
  token: { type: String, require: true },
  expire : {type: String}
})


module.exports = mongoose.model('ResetPassword', resetPasswordSchema);
