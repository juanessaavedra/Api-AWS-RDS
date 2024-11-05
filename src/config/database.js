const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a RDS PostgreSQL');
    console.log('🕒 Tiempo del servidor:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Error al conectar a RDS PostgreSQL');
    console.error('Detalles del error:', err.message);
    console.error('Código del error:', err.code);
  }
};

// Ejecutar la prueba de conexión
testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  end: () => pool.end(),
  testConnection // Exportamos la función de prueba
};