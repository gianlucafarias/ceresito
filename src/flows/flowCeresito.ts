import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'
import { PostgreSQLAdapter } from '~/database/postgresql-adapter'
import { resetInactividad, stopInactividad } from '~/utils/idle'
import { flowAyuda } from './flowAyuda'
import { flowCIC } from './flowCic'
import { flowGenero } from './flowGenero'
import flowLicencias from './flowLicencias'
import flowMenu from './flowMenu'
import flowTramites from './flowTramites'

interface Credentials {
    host: string;
    user: string;
    database: string;
    password: string | null;
    port: number;
  }

// Objeto para almacenar los tiempos de inicio de la conversación por usuario
const credentials: Credentials = {
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    user: process.env.POSTGRES_DB_USER || '',
    database: process.env.POSTGRES_DB_NAME || '',
    password: process.env.POSTGRES_DB_PASSWORD || '',
    port: +process.env.POSTGRES_DB_PORT || 5432,
  };
const database = new PostgreSQLAdapter(credentials)

let errores = 0;
export const flowCeresito = addKeyword<Provider, Database>(['010','ceresito', 'como usar ceresito'])

.addAction(async (ctx, { gotoFlow }) => {
    
    database.contadorFlujos(11) // ceresito
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
}) 

.addAnswer(['Si es la primera vez que chateás conmigo, te cuento algo de mí así me conocés mejor.'], {delay: 2000})
.addAnswer(['¿Sabías que soy un chatbot? Eso significa que:\n',
'🤖 Podés hablarme cuando quieras porque estoy siempre en línea.\n',
'🤖 Mis respuestas son automáticas, y todo el tiempo aprendo cosas nuevas.\n'] , {delay: 4000})
.addAnswer(['Para hablar conmigo lo mejor es usar frases simples, con pocas palabras.\n',
'Mientras más corto sea el mensaje, mejor lo voy a entender. Por ejemplo:\n❌ No me escribas ‘Hola, es para preguntar si puedo sacar un turno el día martes’.\n\n✅ Mejor decime *Turnos* o escribí el número que le corresponda a la opción del menú que te interese.',
], {delay: 4000})

.addAnswer(['¿Estás listo para charlar?\n',
            'Recordá que si no te entiendo o estás perdido, en todo momento podes escribir la palabra *Menú* para volver al menú principal.\n',
], {buttons: [
    {body: 'Ir al Menú'},
]})

.addAction({capture:true}, async (ctx, { gotoFlow, flowDynamic }) => {
    const opcion = ctx.body;
    if (!["tramites", "trámites", "cic", "género", "genero", "licencia", "licencias", "menu", "menú", "hola", "gracias", "no, gracias", 'Ir al Menú'].includes(opcion)) {
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
    case 'Ir al Menú': {
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
}
})

