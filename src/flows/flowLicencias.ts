import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
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

const flowLicencias = addKeyword<Provider, Database>(['002','Licencias', 'licencia', 'como sacar mi licencia', 'Licencias 🪪'])

    .addAction(async (ctx, { gotoFlow }) => {

        database.contadorFlujos(3) //licencias
        .then(() => {
            console.log('Contador del flujo incrementado correctamente');
        })
        .catch((error) => {
            console.error('Error al incrementar el contador del flujo:', error);
        });
        
        startInactividad(ctx, gotoFlow, 160000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
    })   
    .addAnswer('Si vas a conducir un vehículo, sí o sí necesitas contar con una licencia de conducir 🚗🚙🛵🚚🚜', 
    {delay:2000}, async (ctx, { provider } ) => {
    {/*
        const sock = await provider.getInstance();
        const msgPoll = {
        sticker: {
        url:
        "media/licencia.webp"
        }
        };
        (sock as any).sock.sendMessage(ctx.key.remoteJid, msgPoll)
    */}
        })
    .addAnswer('Elegí una de estas opciones y seguimos:', {
        buttons:
            [
                { body: 'Requisitos' },
                { body: 'Sacar turno' },
                { body: 'Volver 🔄' }
            ]
    })
        .addAction({ capture: true }, async (ctx, { provider, flowDynamic, gotoFlow }) => {
            const opcion = ctx.body.trim();
            console.log(opcion)
            if (!["Requisitos","Sacar turno", "Volver 🔄", "menú", "menu"].includes(opcion)) {
                errores++;
                resetInactividad(ctx, gotoFlow, 160000)
                if (errores > 2 )
                {
                    stopInactividad(ctx)
                    return gotoFlow(flowAyuda);

                }
                await flowDynamic("⚠️Opción no encontrada, por favor seleccione una opción válida.");
        
                return gotoFlow(flowLicencias);
            }
            switch (opcion) {
            case 'Requisitos': {
                stopInactividad(ctx)
                await flowDynamic('Toda la info sobre licencias, como tipo de licencias, requisitos, renovación, pérdida y más, lo encontras acá 👇 https://ceres.gob.ar/turnos/ \n\n Escribí *Licencias* para volver al menú anterior o *Menú* para volver al menú principal.');
                break;
            }
            case 'Sacar turno': {
                stopInactividad(ctx)
                await flowDynamic('Ahora podes sacar tu turno desde acá 👇 https://ceres.gob.ar/turnos/ \n\n Escribí *Licencias* para volver al menú anterior o *Menú* para volver al menú principal.');
                break;
            }
            case 'Volver 🔄': {
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
            default: {
                stopInactividad(ctx)
                await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
            }
            }
        });

        export default flowLicencias;