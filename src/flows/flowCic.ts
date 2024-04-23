import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowGenero } from './flowGenero';
import  flowMenu from './flowMenu';
import { PostgreSQLAdapter } from '~/database/postgresql-adapter'

interface Credentials {
    host: string;
    user: string;
    database: string;
    password: string | null;
    port: number;
  }

// Objeto para almacenar los tiempos de inicio de la conversación por usuario
const credentials: Credentials = {
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    user: process.env.POSTGRES_DB_USER || '',
    database: process.env.POSTGRES_DB_NAME || '',
    password: process.env.POSTGRES_DB_PASSWORD || '',
    port: +process.env.POSTGRES_DB_PORT || 5432,
  };
const database = new PostgreSQLAdapter(credentials)
let errores = 0;

export const flowCIC = addKeyword<Provider, Database>(['003','CIC', 'centro integrador comunitario', 'salud', 'telefono cic', 'CIC 🫂'])

        .addAction(async (ctx, { gotoFlow }) => {
            
            database.contadorFlujos(4) // Cic
            .then(() => {
                console.log('Contador del flujo incrementado correctamente');
            })
            .catch((error) => {
                console.error('Error al incrementar el contador del flujo:', error);
            });
            
            startInactividad(ctx, gotoFlow, 160000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
        }) 

        .addAnswer('El Centro de Integración Comunitaria se encuentra en Avenida Perón y Pasaje Melián. Te envío la ubicación:', null, async (ctx, { provider }) => {
            await provider.sendLocation(ctx.from, {
                address: 'CIC',
                lat_number: '-29.880399',
                long_number: '-61.949467',
                name: 'Centro integrado Comunitario'
            })
        })

        .addAnswer(['Acá brindamos un montón de servicios, por ejemplo: ',
        '1. 👉 Salud 👩‍⚕️',
        '2. 👉 Acción social 🤝',
        '3. 👉 Género y diversidad 💜',
        '4. 👉 Cambiar de tema 🔄',

        '\n\n Elegí alguna de esas opciones y te ayudo.',

        ],{delay: 3000})


        
        .addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
            const opcion = ctx.body.toLowerCase().trim();
            if (!["1", "2", "3", "4", "menu", "menú", "x"].includes(opcion)) {
                errores++;
                resetInactividad(ctx, gotoFlow, 90000)
                if (errores > 3 )
                {
                    
                    return gotoFlow(flowAyuda);
                }
                await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");
        
                return gotoFlow(flowCIC);
            }
            switch (opcion) {
            case '1': {
                stopInactividad(ctx)
                    await flowDynamic('En el CIC ofrecemos los siguientes servicios de salud 🩺\n\n Odontología \n Ginecología \n Médica clínica \n Obstetricia \n Pediatría \n Servicio de enfermería\n\n Escribí *CIC* para volver al menú anterior o *Menú* para volver al menú principal.');
                    break;
                }
                case '2': {
                    stopInactividad(ctx)
                    await flowDynamic('Si necesitas ayuda con trámites, en el CIC te orientamos en: \n\n Retención del 20% de AUH \n Tarifa social \n Tarifa de servicio \n Becas Progresar \n Adultos 2000, plan para finalizar la secundaria \n Asesoramiento e inicio de trámites previsionales\n\n Para más info, acercate a Avenida Perón y Pje. Melián 📍\n\n Escribí *CIC* para volver al menú anterior o *Menú* para volver al menú principal.');
                    break;
                }
                case '3': {
                    stopInactividad(ctx)
                    return gotoFlow(flowGenero);
                }
                case '4': {
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
