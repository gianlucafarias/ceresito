// TODO - ESTE ES EL FLUJO QUE SE ACTIVARÁ SI EL TIEMPO SE CONSUME
import { addKeyword, EVENTS } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { detenerContadorConversacion } from './contadorConversacion';

export const flowInactividad = addKeyword<Provider, Database>(EVENTS.ACTION).addAction(
  async (ctx, { endFlow }) => {
    stopInactividad(ctx);
    detenerContadorConversacion(ctx);
    return endFlow("¡Se agotó el tiempo de respuesta! Si querés seguir hablando conmigo, mandame *Hola* 👋");
  }
);
// TODO ----------------------------------------------------------
// Objeto para almacenar temporizadores por usuario
const timers = {};


// Función para iniciar el temporizador
export function startInactividad(ctx, gotoFlow, tiempo) {
  timers[ctx.from] = setTimeout(() => {
    console.log(`¡Tiempo agotado para el usuario ${ctx.from}!`);
    return gotoFlow(flowInactividad); // 🚩🚩🚩 PEGA AQUÍ TU FLUJO (en mi caso flowInactividad)
    // Aquí puedes manejar la lógica correspondiente al vencimiento del tiempo
  }, tiempo);
}


// Función para reiniciar el temporizador
export function resetInactividad(ctx, gotoFlow, tiempo) {
  // Si ya hay un temporizador en marcha para el usuario, lo cancelamos
  stopInactividad(ctx);
  if (timers[ctx.from]) {
    console.log(`REINICIAMOS cuenta atrás para el usuario ${ctx.from}!`);
    clearTimeout(timers[ctx.from]);
  }
  // Iniciamos un nuevo temporizador
  startInactividad(ctx, gotoFlow, tiempo);
}


// Función para detener el temporizador
export function stopInactividad(ctx) {
  // Si hay un temporizador en marcha para el usuario, lo cancelamos
  if (timers[ctx.from]) {
    clearTimeout(timers[ctx.from]);
  }
}
