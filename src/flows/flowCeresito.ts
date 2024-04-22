import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'


export const flowCeresito = addKeyword<Provider, Database>(['ceresito', 'como usar ceresito'])
/*
.addAction(async (ctx, { gotoFlow }) => {
    
    const adapterDB = require('../database/database')
    adapterDB.contadorFlujos(10) // ceresito
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
}) 
*/
.addAnswer(['010','Si es la primera vez que chateás conmigo, te cuento algo de mí así me conocés mejor.'])
.addAnswer(['¿Sabías que soy un chatbot? Eso significa que:\n',
'🤖 Podés hablarme cuando quieras porque estoy siempre en línea.\n',
'🤖 Mis respuestas son automáticas, y todo el tiempo aprendo cosas nuevas.\n'],)
.addAnswer(['Para hablar conmigo lo mejor es usar frases simples, con pocas palabras.\n',
'Mientras más corto sea el mensaje, mejor lo voy a entender. Por ejemplo:\n❌ No me escribas ‘Hola, es para preguntar si puedo sacar un turno el día martes’.\n\n✅ Mejor decime *Turnos* o escribí el número que le corresponda a la opción del menú que te interese.',
])

.addAnswer(['¿Estás listo para charlar?\n',
            'Recordá que si no te entiendo o estás perdido, en todo momento podes escribir la palabra *Menú* para volver al menú principal.\n',
])

.addAction(async (_, { gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})

