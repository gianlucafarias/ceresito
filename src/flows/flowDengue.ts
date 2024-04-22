import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'


export const flowDengue = addKeyword<Provider, Database>(['009','dengue'])
/*
.addAction(async (ctx, { gotoFlow }) => {
    const adapterDB = require('../database/database')
    adapterDB.contadorFlujos(9) // educacion
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
}) 
*/
.addAnswer(['Al dengue lo frenamos trabajando en equipo 💪'])
.addAnswer(['Toda la info sobre esta enfermedad, cómo se trasmite y cómo prevenirlo, lo encontras en nuestra página haciendo clic acá 👇 https://ceres.gob.ar/dengue/\n\n',
            '¡Necesitamos de tu colaboración y acción para prevenirlo! 🦟🚫',
           ]
        )

.addAction({ delay: 9000 }, async (ctx, { flowDynamic, gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})