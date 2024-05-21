import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu';


const obtenerSemanaActual = (): number => {
    const hoy = new Date();
    const dia = hoy.getDate();
    if (dia <= 7) return 1;
    else if (dia <= 14) return 2;
    else if (dia <= 21) return 3;
    else return 4;
};

const calendario: Record<string, Record<string, string>> = {
    '1': {
        'semana1': 'Amarillo',
        'semana2': 'Rojo',
        'semana3': 'Violeta',
        'semana4': 'Azul'
    },
    '2': {
        'semana1': 'Amarillo',
        'semana2': 'Rojo',
        'semana3': 'Violeta',
        'semana4': 'Azul'
    },
    '3': {
        'semana1': 'Amarillo',
        'semana2': 'Rojo',
        'semana3': 'Violeta',
        'semana4': 'Azul'
    },
    '4': {
        'semana1': 'Amarillo',
        'semana2': 'Rojo',
        'semana3': 'Violeta',
        'semana4': 'Azul'
    }
};

export const flowSeccionesPatio2 = addKeyword<Provider, Database>('12')
.addAnswer('Por favor, indícame en qué sección vives (1, 2, 3, 4):')

.addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        const seccionUsuario = ctx.body.trim();
    
    if (!['1', '2', '3', '4'].includes(seccionUsuario)) {
        await flowDynamic("Sección no válida. Por favor, indica una sección válida (1, 2, 3, 4).", { delay: 2000 });
        return;
    }

      // Obtener la semana actual y el día actual
      const semanaActual = obtenerSemanaActual();
      const diaActual = new Date().getDay();
  
      // Verificar si es sábado o domingo
      if (diaActual === 0 || diaActual === 6) {
          await flowDynamic("No hay recolección los días sábados y domingos.", { delay: 2000 });
          return;
      }
   // Verificar si la semana corresponde a la sección del usuario
   if (parseInt(seccionUsuario) === semanaActual) {
    await flowDynamic(`Esta semana, el camión de basura pasa por tu sección (${seccionUsuario}).`, { delay: 2000 });
} else {
    const proximaSemana = semanaActual === 4 ? 1 : semanaActual + 1;
    await flowDynamic(`Esta semana, el camión de basura no pasa por tu sección. Pasará en la semana ${proximaSemana}.`, { delay: 2000 });
}
await flowDynamic('*Algo muy importante: ¡no dejes tus residuos en los pilares de luz porque no podremos recogerlos!*', { delay: 2000 });
    return gotoFlow(flowLlamarMenu);
});