import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowGenero } from './flowGenero';
import  flowMenu from './flowMenu';
import { PostgreSQLAdapter } from '~/database/postgresql-adapter'
import { database } from '~/database';
import { flowSalud } from './flowSalud';
let errores = 0;

const media = 'src/media/cpc_info.png'

export const flowCPC = addKeyword<Provider, Database>(['cpc',])

.addAction(async (ctx, { gotoFlow }) => {
    {/*
    database.contadorFlujos(4) // Cic
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
*/}
    startInactividad(ctx, gotoFlow, 160000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
}) 

.addAnswer('En el Centro de Participación Comunitaria del barrio General López tenemos un montón de servicios de atención primaria de la salud 🩺', null, async (ctx, { provider }) => {
    await provider.sendLocation(ctx.from, {
        address: 'CPC',
        lat_number: '-29.892828',
        long_number: '-61.948573',
        name: 'Centro de Participación Comunitaria'
    })
})
.addAction({delay:3000}, async(ctx, {provider, flowDynamic}) => {
    const id = ctx.from
    await provider.sendImage(id, 'src/media/caps_info.png', 'Todos los servicios de salud en esta placa');

})
.addAction({delay:3000}, async (ctx, {endFlow}) => {
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

        return gotoFlow(flowCPC);
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
