import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowLlamarMenu } from './flowLlamarMenu';
import { flowMujerSegura } from './flowMujerSegura';
import { flowNumeroGuardialocal } from './flowNumeroGuardialocal';
import { flowCIC } from './flowCic';
import  flowMenu from './flowMenu';


export const flowGenero = addKeyword<Provider, Database>(['Genero', 'género'])
        .addAnswer(['Decime qué necesitas saber 👇',
        '1. 👉 Información del área',
        '2. 👉 Información del programa “Mujer segura”',
        '3. 👉 Guardia 24 horas equipo local',
        '4. 👉 Volver al menú anterior 🔄',

        '\n\n Escribí el número del menú sobre el tema que te interese para continuar.',
        ], {delay: 4000}, async (ctx, {gotoFlow}) => {
            startInactividad(ctx, gotoFlow, 120000)
          })
        .addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow, provider }) => {
            const opcion = ctx.body.toLowerCase().trim();

            
            if (!["1", "2", "3", "4", "menu", "menú"].includes(opcion)) {
                resetInactividad(ctx, gotoFlow, 90000)
                await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");
                return gotoFlow(flowGenero);
            }
            switch (opcion) {
            case '1': {
                stopInactividad(ctx)
                await flowDynamic('Desde el área de género y diversidad, brindamos ayuda y asesoramiento a personas que sufren algún tipo de violencia por su género y/o condición 💜\n\nTenemos como fin la creación y puesta en acción de políticas públicas orientadas a promover, prevenir y erradicar cualquier tipo y todas las vulneraciones de derechos en infancias, adolescencias, familias, mujeres y diversidades sexuales \n Si queres conocer más sobre esta área o si necesitas ayuda, podes acercarte al CIC (Avenida Perón y Pje. Melián) o contactate al 3491560492 / 03491422353 🤳.');
                return gotoFlow(flowLlamarMenu);

            }   
                case '2': {
                stopInactividad(ctx)
                return gotoFlow(flowMujerSegura)
            }
            case '3': {
                stopInactividad(ctx)
                return gotoFlow(flowNumeroGuardialocal)
            }
            case '4': {
                stopInactividad(ctx)
                return gotoFlow(flowCIC)
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