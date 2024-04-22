import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowSeccionesPatio } from './flowSeccionesPatio';
import { flowLlamarMenu } from './flowLlamarMenu';
import  flowMenu from './flowMenu';
import { flowAyuda } from './flowAyuda';

let errores = 0;

export const flowResiduos = addKeyword<Provider, Database>(['006','separacion', 'residuos', 'separación residuos', 'separación'])
.addAnswer('Separar los residuos es fundamental para el cuidado de nuestro planeta. Selecciona qué info necesitas saber 🌎', {delay: 1000}, async (ctx, {gotoFlow}) => {
   /*
    const adapterDB = require('../database/database')

    adapterDB.contadorFlujos(6) //residuos
        .then(() => {
            console.log('Contador del flujo incrementado correctamente');
        })
        .catch((error) => {
            console.error('Error al incrementar el contador del flujo:', error);
        });
        */
    startInactividad(ctx, gotoFlow, 120000)
  })
.addAnswer(['¿Sobre qué queres saber? 👇',
'1. 👉 Separación y recolección residuos domiciliarios ♻️',
'2. 👉 Separación y recolección residuos de patio 🍂',
'3. 👉 Info sobre la Cooperativa de Trabajo “Reciclar Ceres” 💪',
'4. 👉 Cambiar de tema 🔄',

'\n\n Escribí el número del menú sobre el tema que te interese para continuar.',
], {delay: 3000})

.addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow,  }) => {
    const opcionresiduos = ctx.body.toLowerCase().trim();
    if (!["1", "2", "3", "4", "menu", "menú"].includes(opcionresiduos)) {
        resetInactividad(ctx, gotoFlow, 90000)
        errores++;

        if (errores > 2 )
        {
            stopInactividad(ctx)
            return gotoFlow(flowAyuda);
        }
        await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");
        return gotoFlow(flowResiduos);
    }
    switch (opcionresiduos) {
        case '1': {
            const diasSemana = ["*Domingo*", "*Lunes*", "*Martes*", "*Miércoles*", "*Jueves*", "*Viernes*", "*Sábado*"];
            const diaActual = new Date().getDay(); // Obtener el día de la semana actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
            const diaSemana = diasSemana[diaActual];
            stopInactividad(ctx)
            switch (diaActual) {
                case 0: {  // Domingo
                    await flowDynamic("Hoy es Domingo, los residuos no se recogen hoy. Pero podes sacar tus residuos humedos esta noche para que sean recolectados.", {delay: 2000});
                    break;
                }
                case 1:  {  // Lunes
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
                    break;
                }
                    
                case 3:  { // Miércoles
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
                    break;
                }
                    
                case 4:  {// Jueves
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
                    break;
                }
                    
                case 6: { // Sábado
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos húmedos*. ", {delay: 2000});
                    break;
                }
                
                case 2: { // Martes
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos secos*. ", {delay: 2000});
                    break;
                }  
                    
                case 5: {  // Viernes
                    await flowDynamic("Los días " + diaSemana + " se recogen *residuos secos*. ", {delay: 2000});
                    break;
                }
                
            }
            await flowDynamic('*Algo muy importante: ¡no dejes tus residuos en los pilares de luz porque no podremos recogerlos!*', {delay: 2000});      
            return gotoFlow(flowLlamarMenu)        
        }
        case '2': {
                stopInactividad(ctx)
                return gotoFlow(flowSeccionesPatio);
            }
        case '3': {
            stopInactividad(ctx)
            await flowDynamic('Hace muy poco, en nuestra ciudad se conformó legalmente, gracias al acompañamiento del municipio, la cooperativa de trabajo “Reciclar Ceres” ♻️\n\n Se trata de un paso súper importante ya que les brinda nuevas oportunidades para su desarrollo y crecimiento económico y profesional. Con su constitución tienen más independencia en sus acciones, podrán acceder a créditos y subsidios; contar con más estabilidad laboral, entre otras cuestiones 💪\n\n Cuando separas los residuos correctamente, colaboras con las personas de esta cooperativa, que trabajan diariamente en el Centro de Disposición Final. ¡Hacelo por el planeta, por vos y por ellos! 💚 \n\nEscribí *Residuos* para volver al menú anterior o *Menú* para volver al menú principal.');
            break;
        }
        case '4': {
            stopInactividad(ctx)
            return gotoFlow(flowMenu)
        }
        case 'menu': {
            stopInactividad(ctx)
            return gotoFlow(flowMenu)
        }
        case 'menú': {
            stopInactividad(ctx)
            return gotoFlow(flowMenu)
        }
}
});
