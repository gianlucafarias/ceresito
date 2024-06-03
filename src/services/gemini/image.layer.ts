import { geminiLayer } from "@builderbot-plugins/gemini-layer"
import fs from 'fs';

const visionPrompt = 'Vas a recibir una imagen y vas a analizar los objetos que se encuentran alli. En base al analisis del objeto, debes responder, primero si ese objeto es reciclable o no. Luego, dependiendo que tipo de reciclado sea, si es un residuo seco se puede sacar los martes y los viernes. Y si es un residuo humedo, se puede sacar la basura los dias lunes, miercoles, jueves y sabado. IMPORTANTE: Si son Pilas u objetos electronicos, tienen un tratamiento especial, por lo que deben acercarse al Punto Verde más cercano.'
const imagepath = 'src/media/ia'; // Ajusta esta ruta según sea necesario

export default async (...bot: any) => await geminiLayer({
    vision: true,
    visionPrompt,
    image_path: imagepath,
    cb: async (_, { state, gotoFlow, flowDynamic }) => {
        const { answer } = state.getMyState()
        console.log('answer about image', answer)
        await flowDynamic(answer)
    }
}, bot)