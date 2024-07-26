const express = require('express');
const Talento = require('../models/Talento');
const router = express.Router();

// Filtros
router.get('/', async (req, res) => {
  try {
    // Obtener filtros desde los parámetros de consulta
    const { tier, nombre, ranked, clases } = req.query;
    // Construir un objeto de consulta dinámico
    let query = {};
    if (tier) {
      query.tier = parseInt(tier); // Convertir a número
    }
    if (nombre) {
      query.nombre = new RegExp(nombre, 'i'); // Búsqueda insensible a mayúsculas
    }
    if (ranked !== undefined) {
      query.ranked = ranked === 'true'; // Convertir 'true' o 'false' a booleano
    }
    if (clases && clases !== 'Todos') {
      query.clases = { $in: clases.split(',') }; // Filtra por clases que coincidan con cualquier valor
    }
    // Obtener talentos con los filtros aplicados
    const talentos = await Talento.find(query);
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
