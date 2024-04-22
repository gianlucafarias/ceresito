import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowLlamarMenu } from './flowLlamarMenu';
import  flowMenu from './flowMenu';

let errores = 0;

export const flowTurismo = addKeyword<Provider, Database>(['004','Turismo', 'hoteles', 'bares'])
.addAction(async (ctx, { gotoFlow }) => {
    /*
    const adapterDB = require('../database/database')
    adapterDB.contadorFlujos(4) //turismo
        .then(() => {
            console.log('Contador del flujo incrementado correctamente');
        })
        .catch((error) => {
            console.error('Error al incrementar el contador del flujo:', error);
        });
        */
    startInactividad(ctx, gotoFlow, 80000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
  })  
.addAnswer('¡Nuestra ciudad tiene un montón de cosas para disfrutar! 🤩')
.addAnswer(['¿Sobre qué queres saber? 👇',
'1. 👉 Hoteles',
'2. 👉 Bares y restaurantes',
'3. 👉 Atractivos turísticos',
'4. 👉 Programación Usina cultural Ceres',
'5. 👉 Cambiar de tema 🔄',
'\n\n Escribí el número del menú sobre el tema que te interese para continuar.',
], {delay: 4000})
.addAction({ capture: true }, async (ctx, { flowDynamic, provider, gotoFlow, endFlow}) => {
    const id = ctx.from
    const opcion = ctx.body.toLowerCase().trim();
    if (!["1", "2", "3", "4", "5", "menu", "menú"].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
        if (errores > 2 )
        {
            stopInactividad(ctx)
            return gotoFlow(flowAyuda);

        }
        await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.", {delay: 3000});

        return gotoFlow(flowTurismo);
    }
    switch (opcion) {
    case '1': {
        stopInactividad(ctx)
        const media = 'src/media/hoteles.png'
        await flowDynamic([{body:'Todos los hoteles y hospedajes de Ceres, en esta placa 🏨', media: media}])
        return gotoFlow(flowLlamarMenu);
    }
        case '2': {
            stopInactividad(ctx)
            await provider.sendImage(id, 'src/media/comedores.png', 'Todos los bares y restaurantes de Ceres, en esta placa 🍹');
            return gotoFlow(flowLlamarMenu);
        }
        case '3': {
            stopInactividad(ctx)
            await provider.sendImage(id, 'src/media/atractivos.png', 'Todos los puntos turísticos y recreativos de Ceres, en esta placa 📸');
            return gotoFlow(flowLlamarMenu);
        }
        case '4': {
            stopInactividad(ctx)
            await flowDynamic('🎬 Para conocer qué hay este fin de semana en la Usina cultural Ceres, entrá a las redes sociales oficiales\n\nInstagram: https://instagram.com/ceresturismo \nFacebook: https://facebook.com/ceresturismo');
            return gotoFlow(flowLlamarMenu);
        }
        case '5': {
            stopInactividad(ctx)
            return gotoFlow(flowMenu)
        }
    case 'menu': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    case 'menú': {
        stopInactividad(ctx)
        return gotoFlow(flowMenu)
    }
    }
});