import { addKeyword, EVENTS } from '@builderbot/bot'
import consultarContactos from 'src/utils/consultarContactos'
import { flowPrimeraVez } from './flowPrimeraVez'
import  flowMenu  from './flowMenu'
import { join } from 'path'
import { iniciarContadorConversacion } from '../database/contadorConversacion'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

export const flowPrincipal = addKeyword<Provider>(["hola","buenas tardes", "buenos dias", EVENTS.WELCOME])
.addAction(
    { delay: 3000 },
    async (ctx, { provider, flowDynamic, gotoFlow }) => {
        
      const name = ctx.name;
      const telefono = ctx.from;
      await flowDynamic(`🙌 ¡Hola ${name}! Soy Ceresito y volví 😎`);
      await flowDynamic('No soy un superhéroe pero puedo ayudarte de muchas maneras 🦸‍♀️',{delay: 3000} )
      const existeContacto = await consultarContactos(name, telefono);
                    
      if (existeContacto) {
          // Si el contacto existe, ir al flujoMenu
          return gotoFlow(flowMenu);
      } else {
          // Si el contacto no existe, ir al flujo de bienvenida
          return gotoFlow(flowPrimeraVez);
      }
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
