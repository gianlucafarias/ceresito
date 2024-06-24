import { addKeyword, EVENTS } from '@builderbot/bot'
import consultarContactos from 'src/utils/consultarContactos'
import { flowPrimeraVez } from './flowPrimeraVez'
import  flowMenu  from './flowMenu'
import { join } from 'path'
import { iniciarContadorConversacion } from '../database/contadorConversacion'
import { MetaProvider as Provider } from '@builderbot/provider-meta'


const sticker = 'src/media/colectividades.png'


export const flowPrincipal = addKeyword<Provider>(["hola","buenas tardes", "buenos dias"])


.addAction(
    { delay: 3000 },
    async (ctx, { provider, flowDynamic, gotoFlow }) => {
      
      iniciarContadorConversacion(ctx);
      const name = ctx.name;
      const telefono = ctx.from;
      await flowDynamic(`🙌 ¡Hola ${name}! Soy Ceresito, el chatbot del Gobierno de la Ciudad de Ceres. 😎`);
    
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