import { geminiLayer } from "@builderbot-plugins/gemini-layer"
import fs from 'fs';

const visionPrompt = 'Dame un porcentaje de 0 a 100 sobre si el objeto que encuentras en la imagen es reciclable o no. '
const imagepath = 'src/media/ia'; // Ajusta esta ruta según sea necesario

export default async (...bot: any) => await geminiLayer({
    vision: true,
    visionPrompt,
    image_path: './',
    cb: async (_, { state, gotoFlow, flowDynamic }) => {
        const { answer } = state.getMyState()
        console.log('answer about image', answer)
        await flowDynamic(answer)
    }
}, bot)