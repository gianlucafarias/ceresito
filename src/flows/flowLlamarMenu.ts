import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'


import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowCIC } from './flowCic';
import  flowTramites  from './flowTramites';
import { flowGenero } from './flowGenero';
import flowLicencias from './flowLicencias';
import  flowMenu from './flowMenu';

let errores = 0;

export const flowLlamarMenu = addKeyword<Provider, Database>(['$menu'])
.addAnswer('Querés hacer otra consulta? También podes escribir *Trámites*, *CIC*, *Género* o *Licencias* para otras opciones.',
{delay: 6000, buttons:
[
    { body: 'No, Gracias' },
    { body: 'Volver al menú principal' }
]
})

  .addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body.toLowerCase().trim();
    if (!["tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "volver al menú principal"].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
            if (errores > 2 )
            {
                stopInactividad(ctx)
                return gotoFlow(flowAyuda);

            }
        await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
    }
    switch (opcion) {
    case 'cic': {
        stopInactividad(ctx)
        return gotoFlow(flowCIC)
    }
    case 'tramites': {
        stopInactividad(ctx)
        return gotoFlow(flowTramites)
    }
    case 'tramite': {
        stopInactividad(ctx)
        return gotoFlow(flowTramites)
    }
    case 'trámite': {
        stopInactividad(ctx)
        return gotoFlow(flowTramites)
    }
    case 'trámites': {
        stopInactividad(ctx)
        return gotoFlow(flowTramites)
    }
    case 'genero': {
        stopInactividad(ctx)
        return gotoFlow(flowGenero)
    }
    case 'género': {
        stopInactividad(ctx)
        return gotoFlow(flowGenero)
    }
    case 'licencia': {
        stopInactividad(ctx)
        return gotoFlow(flowLicencias)
    }
    case 'licencias': {
        stopInactividad(ctx)
        return gotoFlow(flowLicencias)
    }
    case 'menú': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'menu': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'volver al menú principal': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'no, gracias': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    default: await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
    }
});
