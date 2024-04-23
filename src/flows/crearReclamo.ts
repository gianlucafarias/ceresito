import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowCargarReclamo } from './reclamo/flowCargarReclamo';
import flowMenu from './flowMenu';
let errores = 0;
export const flowCrearReclamo = addKeyword<Provider, Database>(['005','console'])
.addAction(async (ctx, { gotoFlow }) => {
    startInactividad(ctx, gotoFlow, 1600000)
  })
  .addAnswer('¡Perfecto! Voy a ayudarte a cargar tu reclamo ⚠️. Para eso voy a pedirte los siguientes datos:\n\n1. Tipo de Reclamo (Higiene urbana, Árboles, Arreglos) Recordá que solo podes elegir uno de esas opciones disponibles. \n2. Dónde se encuentra ubicado el problema (Nombre de Calle y Número)\n3. Barrio donde se encuentra el problema.\n4. Una breve descripción del problema para que podamos entender mejor la situación.\n\nUna vez que me envias estos datos ya podré guardar tu solicitud. \n\n¿Estás listo?',
  {
    buttons: [
        {body: 'Hacer Reclamo'},
        {body: 'Volver al menú'}
    ]
  })
  .addAction({capture:true}, async (ctx, { flowDynamic, gotoFlow }) => {
    const option = ctx.body.toLowerCase().trim();
    console.log(option)
    if (!["hacer reclamo", "volver al menú"].includes(option)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 1600000)
        if (errores > 2 )
        {
            stopInactividad(ctx)
            return gotoFlow(flowAyuda);
        }
        await flowDynamic('⚠️ Opción no encontrada, por favor seleccione una opción válida.');
        return gotoFlow(flowCrearReclamo);
    }
    switch (option) {
        case 'hacer reclamo': {
            stopInactividad(ctx)
            return gotoFlow(flowCargarReclamo)
        }
        case 'volver al menú': {
            stopInactividad(ctx)
            return gotoFlow(flowMenu)
        }
    }
  }
)
