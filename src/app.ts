import { createBot, addAnswer, addKeyword, EVENTS, createFlow } from '@builderbot/bot'
import { provider } from './provider'
import { flow } from './flows'
import { MemoryDB } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import  flowMenu from './flows/flowMenu'
import flowEducacion from './flows/flowEducacion'
import { database } from './database'
const PORT = process.env.PORT ?? 3008
interface Credentials {
    host: string;
    user: string;
    database: string;
    password: string | null;
    port: number;
  }

const main = async () => {

    const credentials: Credentials = {
        host: process.env.POSTGRES_DB_HOST || 'localhost',
        user: process.env.POSTGRES_DB_USER || 'tu_usuario',
        database: process.env.POSTGRES_DB_NAME || 'nombre_de_la_base_de_datos',
        password: process.env.POSTGRES_DB_PASSWORD || 'tu_contraseña',
        port: +process.env.POSTGRES_DB_PORT || 5432,
      };
    const adapterDB = new MemoryDB()
    const { handleCtx, httpServer } = await createBot({
        flow,
        provider,
        database: adapterDB,
    })

    provider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    provider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    provider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    provider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    provider.on('message', ({ body, from }) => {
        console.log(`Message Payload:`, { body, from })
    })


    httpServer(+PORT)
}

main()
