import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu';

export const flowColectividades = addKeyword<Provider, Database>(['Colectividades', 'fiesta de las colectividades'])

.addAnswer('¡Este Domingo 30 llega una nueva *Fiesta de las Colectividades* a la Ciudad! Te esperamos desde las 10.30 horas en el Escenario del Centenario.')

.addAction({delay: 3000}, async (ctx, { flowDynamic}) => {
        const media = 'src/media/colectividades.png'
        await flowDynamic([{body:'Toooda la info de la Fiesta a continuación 🎉👇', media: media, delay: 3000}])
})
.addAction({delay: 12000}, async (ctx, { gotoFlow}) => {
   return gotoFlow(flowLlamarMenu);
});