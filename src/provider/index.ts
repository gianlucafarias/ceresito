import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { createProvider } from "@builderbot/bot"

export const provider = createProvider(Provider, {
    jwtToken: process.env.JWT_TOKEN_META,
    numberId: process.env.NUMBER_ID_META,
    verifyToken: process.env.VERIFY_TOKEN_META,
    version: 'v19.0'
})