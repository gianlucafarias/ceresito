import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'


export const flowConsejoAdultos = addKeyword<Provider, Database>('consejo adultos mayores')
.addAnswer('En el 2021, se conformó el Consejo de Adultos Mayores por impulso del Gobierno de la Ciudad 💛 \n\n Esta iniciativa tiene como fin trabajar en la participación ciudadana e impulsar acciones que mejoren la calidad de vida de los adultos mayores 💪')
.addAnswer(['Actualmente, las comisiones se encuentran divididas de la siguiente manera:',
            'Juegos, deporte y recreación',
            'Salud',
            'Cultura y educación',
            'Género y diversidad'])
.addAnswer('Si queres sumarte a esta propuesta, acercarte al CIC y te damos toda la info 💛')

.addAction({ delay: 9000 }, async (ctx, { flowDynamic, gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})


