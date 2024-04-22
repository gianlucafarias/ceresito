import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'


export const flowAyuda = addKeyword<Provider, Database>('ayuda')
.addAnswer('Parece que no encuentro la opción que buscas. ¿Necesitas ayuda?')
.addAction({ delay: 9000 }, async (ctx, { flowDynamic, gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})
