import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { resetInactividad, stopInactividad } from '~/utils/idle';
import { flowAyuda } from './flowAyuda';
import { flowCIC } from './flowCic';
import { flowGenero } from './flowGenero';
import flowLicencias from './flowLicencias';
import flowMenu from './flowMenu';
import flowTramites from './flowTramites';
import { flowLlamarMenu } from './flowLlamarMenu';

let errores = 0;
export const flowCongresoMujeres = addKeyword<Provider, Database>('congreso de mujeres lideres')
.addAnswer('Si querés inscribirte en este evento único o conocer más sobre el Congreso, seleccioná alguna de las tres opciones 👇',{
    buttons: [
    {body: '✍️ Inscripción'},
    {body: '💜 Programa'},
    {body: '🤳 Redes'},
]}
)
.addAction({ capture: true }, async (ctx, { provider, endFlow, flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body;
    console.log(opcion)
    const nombre = ctx.name;
    if (!["🤳 Redes","💜 Programa","✍️ Inscripción","tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "Volver al menu", "volver al menú"].includes(opcion)) {
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
        case '✍️ Inscripción': {
            stopInactividad(ctx)
            await flowDynamic('Completá este formulario y ya estás anotada para participar de este gran Congreso https://bit.ly/3congresodemujeres  ✍️💜')
            return gotoFlow(flowLlamarMenu)
        }
        case '💜 Programa': {
            const id = ctx.from;
            stopInactividad(ctx)
            await provider.sendImage(id, 'src/media/programa_congreso.png', '¡Conocé las disertantes increíbles que nos acompañarán!');
            return gotoFlow(flowLlamarMenu)
        }
        case '🤳 Redes': {
            stopInactividad(ctx)
            await flowDynamic('Seguinos en Instagram www.instagram.com/congresoregionalmujereslideres\nO en Facebook https://www.facebook.com/congresoregionalmujereslideres?mibextid=LQQJ4d 📲')
            return gotoFlow(flowLlamarMenu)
        }
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
    default: await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
    }
});

