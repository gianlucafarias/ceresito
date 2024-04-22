import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { flowLlamarMenu } from './flowLlamarMenu'

export const flowNumeroGuardialocal = addKeyword<Provider, Database>('guardia local')
.addAnswer('Te paso el contacto de la guardia local.', null, async (ctx, { provider }) => {
    await provider.sendContacts(ctx.from, [
        {
            name: {
                formatted_name: 'Guardia local',
                first_name: 'Guardia Local CIC'
            },
            phones: [{
                phone: '54543491560835',
                type: 'HOME',
                wa_id: '543491560835' // (optional) makes META identify the number as an active wpp user
            }]
        }
    ])
})
.addAction({ delay: 9000 }, async (ctx, { flowDynamic, gotoFlow }) => {
    return gotoFlow(flowLlamarMenu)
})