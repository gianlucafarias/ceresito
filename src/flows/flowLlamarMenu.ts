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
import { detenerContadorConversacion } from '~/utils/contadorConversacion';

let errores = 0;

export const flowLlamarMenu = addKeyword<Provider, Database>(['$menu'])
.addAction(async(ctx) => {
    detenerContadorConversacion(ctx);
})
.addAnswer('Querés hacer otra consulta? También podes escribir *Trámites*, *CIC*, *Género* o *Licencias* para otras opciones.',
{delay: 8000, buttons:
[
    { body: 'No, Gracias' },
    { body: 'Volver al menú' }
]
})
  .addAction({ capture: true }, async (ctx, { endFlow, flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body.toLowerCase().trim();
    console.log(opcion)
    const nombre = ctx.name;
    if (!["tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "Volver al menu", "volver al menú"].includes(opcion)) {
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
    case 'volver al menú': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'Volver al menú': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'Volver al menu': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
        case 'no, gracias': {
        stopInactividad(ctx)
        return endFlow(`De nada ${nombre} 😃. Si necesitas información estoy disponible 24/7.`)
    }
    }
});
