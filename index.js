const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const talentosRouter = require('./routes/Talentos.js'); // Asegúrate de importar el router
const Talento = require('./models/Talento.js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
    insertarTalentosDesdeJSON();
}).catch((err) => {
    console.error('Error de conexion: ', err);
});

// Usa el router para manejar las rutas de talentos
app.use('/api/talentos', talentosRouter);

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

async function insertarTalentosDesdeJSON() {
    try {
        const filePath = path.join(__dirname, 'talentos.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const talentos = JSON.parse(data);

        for (let talento of talentos) {
            const existeTalento = await Talento.findOne({ nombre: talento.nombre });
            if (existeTalento) {
                console.log(`El talento '${talento.nombre}' ya existe en la base de datos. No se insertará nuevamente.`);
                continue;
            }

            talento.clases = talento.clases || [];
            const nuevoTalento = new Talento(talento);
            await nuevoTalento.save();
        }
    } catch (error) {
        console.error('Error al guardar los talentos:', error);
    }
}
