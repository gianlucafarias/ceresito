import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'
import { PostgreSQLAdapter } from '~/database/postgresql-adapter'

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

.addAnswer(['Si es la primera vez que chateás conmigo, te cuento algo de mí así me conocés mejor.'])
.addAnswer(['¿Sabías que soy un chatbot? Eso significa que:\n',
'🤖 Podés hablarme cuando quieras porque estoy siempre en línea.\n',
'🤖 Mis respuestas son automáticas, y todo el tiempo aprendo cosas nuevas.\n'],)
.addAnswer(['Para hablar conmigo lo mejor es usar frases simples, con pocas palabras.\n',
'Mientras más corto sea el mensaje, mejor lo voy a entender. Por ejemplo:\n❌ No me escribas ‘Hola, es para preguntar si puedo sacar un turno el día martes’.\n\n✅ Mejor decime *Turnos* o escribí el número que le corresponda a la opción del menú que te interese.',
])

.addAnswer(['¿Estás listo para charlar?\n',
            'Recordá que si no te entiendo o estás perdido, en todo momento podes escribir la palabra *Menú* para volver al menú principal.\n',
])

.addAction({delay: 6000}, async (_, { gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})

