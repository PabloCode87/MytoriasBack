const express = require('express');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Mytorias';
const cors = require('cors');
const talentosRouter = require('./routes/Talentos.js');
const Talento = require('./models/Talento.js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081', // Ajusta esto según tu frontend
    optionsSuccessStatus: 200
};

// Usa CORS
app.use(cors(corsOptions));

//Analiza los cuerpos de los json
app.use(express.json());

// Conexión MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
    // Lógica para insertar talentos desde un archivo JSON
    insertarTalentosDesdeJSON();
}).catch((err) => {
    console.error('Error de conexión: ', err);
});

//Rutas para talentos (talentosRouter)
app.use('/api/talentos', talentosRouter);

//Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Función para insertar talentos desde un archivo JSON
async function insertarTalentosDesdeJSON() {
    try {
        // Lee el archivo JSON de talentos
        const filePath = path.join(__dirname, 'talentos.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const talentos = JSON.parse(data);

        for (let talento of talentos) {
            //Verifica si ya existe un talento con el mismo nombre
            const existeTalento = await Talento.findOne({ nombre: talento.nombre });
            if (existeTalento) {
                console.log(`El talento '${talento.nombre}' ya existe en la base de datos. No se insertará nuevamente.`);
                continue;
            }
            //Crea un nuevo documento de Talento y guárdalo en la base de datos
            const nuevoTalento = new Talento(talento);
            await nuevoTalento.save();
        }
    } catch (error) {
        console.error('Error al guardar los talentos:', error);
    }
}
