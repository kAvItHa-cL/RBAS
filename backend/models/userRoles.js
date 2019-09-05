const mongoose = require('mongoose');

const userRoleSchema = mongoose.Schema({
  userId: { type: String, require: true },
  roleId: { type: Number, require: true }
})


module.exports = mongoose.model('UserRole', userRoleSchema);
