import { addKeyword, EVENTS } from '@builderbot/bot'
import consultarContactos from 'src/utils/consultarContactos'
import { flowPrimeraVez } from './flowPrimeraVez'
import  flowMenu  from './flowMenu'
import { join } from 'path'
import { iniciarContadorConversacion } from '../database/contadorConversacion'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { database } from '~/database'

export const flowPrincipal = addKeyword<Provider>(["hola","buenas tardes", "buenos dias", EVENTS.ACTION])
.addAction(
    { delay: 3000 },
    async (ctx, { provider, flowDynamic, gotoFlow }) => {

      const name = ctx.name;
      await flowDynamic(`🙌 ¡Hola ${name}! Soy Ceresito, y volví 😎`);
      await flowDynamic('No soy un superhéroe pero puedo ayudarte de muchas maneras 🦸‍♀️',{delay: 3000} )
      return gotoFlow(flowMenu);
    }
    
)


const body = 
    {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "{{Recipient-Phone-Number}}",
        "type": "sticker",
        "sticker": {
            "id": "./media/ceresito.webp"
        }
    }
