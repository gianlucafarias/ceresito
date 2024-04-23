import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import  flowMenu from './flowMenu';
import { flowAyuda } from './flowAyuda';
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

const flowTramites = addKeyword<Provider, Database>(['001','Trámites', 'tramite', 'trámite', 'trámites', 'quiero hacer un tramite', 'Trámites 🗃️'])
.addAction(async (ctx, { gotoFlow }) => {

            database.contadorFlujos(1) // tramites
            .then(() => {
                console.log('Contador del flujo incrementado correctamente');
            })
            .catch((error) => {
                console.error('Error al incrementar el contador del flujo:', error);
            });
             
            startInactividad(ctx, gotoFlow, 80000); // ⬅️⬅️⬅️  INICIAMOS LA CUENTA ATRÁS PARA ESTE USUARIO
        }) 
       
    .addAnswer('Hacer trámites puede ser muy aburrido y estresante, por eso quiero facilitarte las cosas 💪' )
    .addAnswer([
        'Ahora puedes hacer lo siguiente desde acá:',
        'Contame, ¿sobre qué necesitas saber?',
        'Escribí el número del menú sobre el tema que te interese para continuar.\n\n',
        '1. 👉 Camino rural',
        '2. 👉 Moratorias',
        '3. 👉 Cambiar de tema 🔄',
    ], { delay:1000, capture: true }, async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
        const opcion = ctx.body.toLowerCase().trim();
        if (!["1", "2", "3", "menu", "menú"].includes(opcion)) {
            errores++;
                resetInactividad(ctx, gotoFlow, 90000)
                if (errores > 2 )
                {
                    stopInactividad(ctx)
                    return gotoFlow(flowAyuda);
                }
            await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");

            return gotoFlow(flowTramites);
        }
        switch (opcion) {
            
        case '1': {
            stopInactividad(ctx)
            return endFlow('Si queres pagar este impuesto, hace clic acá 👇https://bit.ly/pagarimpuestosceres \n\n Volvé a escribir *Tramites* para volver al menú anterior o *Menú* para volver al menú principal.');
        }
        case '2': {
            stopInactividad(ctx)
            return endFlow('Si estás adherido a una moratoria y queres pagarla, hace clic acá 👇 https://bit.ly/pagarimpuestosceres \n\n Volvé a escribir *Tramites* para volver al menú anterior o *Menú* para volver al menú principal.');
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
        default: {
            stopInactividad(ctx)
            await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
        }
        }
    });

export default flowTramites;