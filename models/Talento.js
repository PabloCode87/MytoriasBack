const mongoose = require('mongoose');

const talentoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tier: { type: Number, required: true },
    activacion: { type: String, required: true },
    ranked: { type: Boolean, required: true },
    clases: { type: [String], required: true },
    descripcion: { type: String, required: true },
  });

const Talento = mongoose.model('Talento', talentoSchema);

module.exports = Talento;