import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import  flowMenu from './flowMenu';
import { flowCeresito } from './flowCeresito';
import { flowAyuda } from './flowAyuda';

let errores = 0;

export const flowPrimeraVez = addKeyword<Provider, Database>(['$primera_vez'])
.addAnswer('¡Bienvenido! Estoy acá para ayudarte 24/7 con cualquier pregunta o información que necesites.')
.addAnswer('Para que sea más facil entenderte, solo tenes que seleccionar la opción que te interese. Si es la primera vez que hablas conmigo, te recomiendo ir a la opción *1* para conocerme. Si queres hacerme una consulta, podés ir al Menú Principal en la opción *2*.')
.addAnswer('¿Cómo seguimos?',{
    buttons: [
        {body: '¿Cómo se usa?'},
        {body: 'Ir al Menú'}
    ]
})
.addAction(
{ delay: 2000, capture: true }, async (ctx, { fallBack, gotoFlow, flowDynamic  }) => {

    const option = ctx.body;

    if (!["¿Cómo se usa?", "Ir al Menú"].includes(option)) {
        resetInactividad(ctx, gotoFlow, 90000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
        await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción dentro del menú.");

        errores++;

    if (errores > 2 )
    {
        stopInactividad(ctx)
        return gotoFlow(flowAyuda);

    }
        return gotoFlow(flowPrimeraVez) ;
    }

    if (option === "¿Cómo se usa?") {
        stopInactividad(ctx); // ⬅️⬅️⬅️  HEMOS LLEGADO AL FINAL DEL FLUJO, ASI QUE PARO LA CUENTA ATRÁS
        return gotoFlow(flowCeresito);
    }

    if (option === "Ir al Menú") {
        stopInactividad(ctx); // ⬅️⬅️⬅️  HEMOS LLEGADO AL FINAL DEL FLUJO, ASI QUE PARO LA CUENTA ATRÁS
        return gotoFlow(flowMenu);
    }
  })