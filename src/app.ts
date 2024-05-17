import { createBot } from '@builderbot/bot'
import { provider } from './provider'
import { flow } from './flows'
import { MemoryDB } from '@builderbot/bot'
import polka from 'polka';
import {startServer} from './services/api/server'
import path from 'path';
import serveStatic from 'serve-static';

const body = {
    "messaging_product": "whatsapp",
    "type": "template",
    "template": {
        "name": 'ceresito_is_back',
        "language": {
            "code": 'es_AR',
        },
    }
};

const PORT = process.env.PORT ?? 3000
const main = async () => {

    const adapterDB = new MemoryDB()
    const { handleCtx, httpServer } = await createBot({
        flow,
        provider,
        database: adapterDB,
    }, {
        queue: {
            timeout: 20000, //👌
            concurrencyLimit: 60 //👌
        }
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
        '/v1/template',
        handleCtx(async (bot, req, res) => {
            const { number, template, languageCode } = req.body
            await bot.provider.sendTemplate(number, template, languageCode)
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
