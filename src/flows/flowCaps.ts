import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import  flowMenu from './flowMenu';
import { flowSalud } from './flowSalud';
let errores = 0;

export const flowCaps = addKeyword<Provider, Database>(['caps',])

.addAction(async (ctx, { gotoFlow }) => {
    startInactividad(ctx, gotoFlow, 160000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
}) 
.addAnswer('En el CAPS del barrio Nueva Esperanza tenemos un montón de servicios de atención primaria de la salud 🩺 Te envío la ubicación:', null, async (ctx, { provider }) => {
    await provider.sendLocation(ctx.from, {
        address: 'Leandro N Alem',
        lat_number: '-29.873811',
        long_number: '-61.948698',
        name: 'Salón Barrio Nueva Esperanza'
    })
})
.addAction({delay:3000}, async(ctx, {provider, flowDynamic}) => {
    const id = ctx.from
    await provider.sendImage(id, 'src/media/caps_info.png', 'Todos los servicios de salud en esta placa');

})
.addAction({delay:6000}, async (ctx, {endFlow}) => {
    return endFlow('Escribí *Salud* para volver al menú anterior o *Menú* si querés volver al menú principal.');
})

.addAction({ capture: true }, async (ctx, {endFlow, flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.toLowerCase().trim();
    if (!["salud", "menu", "menú"].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
        if (errores > 3 )
        {
            
            return gotoFlow(flowAyuda);
        }
        await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");

        return gotoFlow(flowCaps);
    }
    switch (opcion) {
        case 'salud': {
            stopInactividad(ctx)
            return gotoFlow(flowSalud)
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
