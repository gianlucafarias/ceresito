import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

export const flowGenero = addKeyword<Provider, Database>(['gracias', 'muchas gracias', 'No, gracias.'])
.addAction(async (ctx, {flowDynamic ,gotoFlow }) => {
    const nombre = ctx.name
    /*
    const adapterDB = require('../database/database')
    adapterDB.contadorFlujos(2) //licencias
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
    */
    await flowDynamic(`De nada ${nombre} 😃. Si necesitas información estoy disponible 24/7.`)
})  