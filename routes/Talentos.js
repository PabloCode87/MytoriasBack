const express = require('express');
const Talento = require('../models/Talento');
const router = express.Router();

router.get('/', async (req, res) => {
    const { tier, nombre, clases } = req.query;
    let filter = {};

    if (tier) {
        filter.tier = tier;
    }

    if (nombre) {
        filter.nombre = { $regex: nombre, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    }

    if (clases && clases !== 'All') {
        filter.clases = { $in: clases.split(',') };
    }

    try {
        const talentos = await Talento.find(filter);
        res.json(talentos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
