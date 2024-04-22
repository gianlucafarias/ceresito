import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { nanoid } from 'nanoid'

export const flowAgente = addKeyword('PELIGRO', {sensitive: true})
.addAnswer('Estamos creando una conexion con un agente local de ojos en alerta...')
.addAction(async (ctx, {provider}) => {
    const ID_GROUP = nanoid(5)
    const refProvider = await provider.getInstance()
    await refProvider.groupCreate(`Ojos en Alerta Reclamo: (${ID_GROUP})`,[
        `${ctx.from}@s.whatsapp.net`
    ])
})
