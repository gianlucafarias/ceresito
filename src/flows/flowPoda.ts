import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda'
import { flowInscripcionPoda } from './flowInscripcionPoda'
import flowMenu from './flowMenu'
let errores = 0;

export const flowPoda = addKeyword<Provider, Database>('poda')
.addAnswer('¡Llegó el otoño y con él la época de poda! 🌳 \nDesde el Gobierno de la ciudad queremos brindarte información importante al respecto: \n- Según la Ley Provincial N° 13836 y la Ordenanza Municipal N° 1726/2021 el responsable de realizar la poda de arbolado público es el Municipio 💪\n\n - Para cuidar el árbol, el momento ideal para realizar la poda es en el receso invernal. Es el momento en que los árboles de hojas caducas las pierden todas 🍂')

.addAnswer('¿Necesitas podar algún árbol del frente de tu casa? 👇',
{delay: 5000, buttons:
[
    { body: 'Si' },
    { body: 'Volver al menú' }
]
})
.addAction({ capture: true }, async (ctx, { endFlow, flowDynamic, gotoFlow, fallBack }) => {
    const opcion = ctx.body;
    console.log(opcion)
    if (!["tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", "Volver al menu", "volver al menú", "si", "Si"].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
            if (errores > 2 )
            {
                stopInactividad(ctx)
                return gotoFlow(flowAyuda);
            }
            await flowDynamic('⚠️ Opción no encontrada, por favor seleccione una opción válida.');
            return gotoFlow(flowPoda);        
    }
    switch (opcion) {
        case 'Si': 
        stopInactividad(ctx)
        return gotoFlow(flowInscripcionPoda);
        case 'Volver al menú': 
        stopInactividad(ctx)
        return gotoFlow(flowMenu);
    }
})