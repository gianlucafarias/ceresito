import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowLlamarMenu } from './flowLlamarMenu';
import  flowMenu from './flowMenu';
 

  let errores = 0;

const flowEducacion = addKeyword<Provider, Database>(['007','Educación 📚', 'educacion'])
.addAction(async (ctx, { gotoFlow }) => {
    /*
    const adapterDB = require('../database/database')
    adapterDB.contadorFlujos(7) // educacion
    .then(() => {
        console.log('Contador del flujo incrementado correctamente');
    })
    .catch((error) => {
        console.error('Error al incrementar el contador del flujo:', error);
    });
    */
    startInactividad(ctx, gotoFlow, 160000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
})   
.addAnswer('¿Querés estudiar? ¡Te felicitamos! En Ceres podes capacitarte en dos carreras universitarias y también en robótica 🤓')
.addAnswer(['¿Sobre qué queres saber? 👇',
'1. 👉 Tecnicaturas de la UTN en Ceres',
'2. 👉 Robótica y Club de Ciencias',
'3. 👉 Cambiar de tema 🔄',
'\n\n Escribí el número del menú sobre el tema que te interese para continuar.',
], {delay: 4000})

.addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.toLowerCase().trim();
    if (!["1", "2", "3", "menu", "menú"].includes(opcion)) {
        errores++;
        resetInactividad(ctx, gotoFlow, 90000)
        if (errores > 2 )
        {
            stopInactividad(ctx)
            return gotoFlow(flowAyuda);
        }
        await flowDynamic('⚠️ Opción no encontrada, por favor seleccione una opción válida.');
        return gotoFlow(flowEducacion);
    }
    switch (opcion) {
    case '1': {
        stopInactividad(ctx)
        await flowDynamic('¡Genial! En Ceres podes cursar dos carreras con mucha salida laboral \n\n Tecnicatura en Administración Rural 📚 \n Tecnicatura en Programación 📚 \n\n Toda la información sobre estas carreras pertenecientes a la UTN, la encontras en este instagram 👇 https://instagram.com/utnceresextension');
        return gotoFlow(flowLlamarMenu)
    }
    case '2': {
        stopInactividad(ctx)
        await flowDynamic('El Club de Ciencias fue una gestión realizada por el municipio y permite que niños, jóvenes y adolescentes puedan capacitarse en robótica 🤖 \n\n Si queres más información, contactate al 03491-421990 📞 \n\nEscribí *Educación* para volver al menú anterior o *Menú* para volver al menú principal.');
        return gotoFlow(flowLlamarMenu)
    }
    case '3': {
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


export default flowEducacion;