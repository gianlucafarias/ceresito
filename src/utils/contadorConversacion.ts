import { PostgreSQLAdapter } from '~/database/postgresql-adapter'

interface Credentials {
    host: string;
    user: string;
    database: string;
    password: string | null;
    port: number;
  }

// Objeto para almacenar los tiempos de inicio de la conversación por usuario
const credentials: Credentials = {
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    user: process.env.POSTGRES_DB_USER || '',
    database: process.env.POSTGRES_DB_NAME || '',
    password: process.env.POSTGRES_DB_PASSWORD || '',
    port: +process.env.POSTGRES_DB_PORT || 5432,
  };
const database = new PostgreSQLAdapter(credentials)



// Objeto para almacenar los tiempos de inicio de la conversación por usuario
const conversationStartTimes = {};

// Función para iniciar el contador de conversación
export function iniciarContadorConversacion(ctx) {
  conversationStartTimes[ctx.from] = Date.now(); // Guarda el tiempo de inicio de la conversación
}

// Función para detener y registrar la duración de la conversación
export async function detenerContadorConversacion(ctx) {
    if (conversationStartTimes[ctx.from]) {
      const nombre = ctx.pushName;
      const telefono = ctx.from;
      const tiempoInicio = conversationStartTimes[ctx.from];
      const tiempoFin = Date.now();
      const duracionMilisegundos = tiempoFin - tiempoInicio;
      const duracionMinutos = Math.floor(duracionMilisegundos / 60000); // Convertir a minutos
      const duracionSegundos = Math.floor((duracionMilisegundos % 60000) / 1000); // Obtener los segundos restantes
      const duracionFormateada = `${duracionMinutos}:${duracionSegundos.toString().padStart(2, '0')}`; // Formatear minutos y segundos

      console.log(`La conversación con el usuario ${ctx.from} duró ${duracionFormateada} minutos.`);
      delete conversationStartTimes[ctx.from];
      try {
         await database.ingresarDatosConversacion(nombre, telefono, duracionFormateada);
      } catch (error) {
        console.error('Error al insertar los datos de la conversación en la base de datos:', error);
      }
    }
  }