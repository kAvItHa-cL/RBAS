const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
  id: { type: Number, require: true },
  name: { type: String, require: true }
})


module.exports = mongoose.model('Role', roleSchema);
