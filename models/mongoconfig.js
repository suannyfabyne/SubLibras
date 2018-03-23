
var mongoose = require('mongoose');

var DoadorSchema = new mongoose.Schema({
  nome: String,
  email: String,
  tipo: String,
  idade: Number,
});


mongoose.model('File', DoadorSchema);