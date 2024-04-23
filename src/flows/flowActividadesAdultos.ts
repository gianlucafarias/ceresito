import { GoogleSpreadsheet } from 'google-spreadsheet'
    import fs from 'fs'
    import { JWT } from 'google-auth-library';
    const RESPONSES_SHEET_ID = process.env.RESPONSES_SHEET_ID
    const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json', 'utf-8'));
const serviceAccountAuth = new JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

    import { addKeyword } from '@builderbot/bot'
    import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
    import { MetaProvider as Provider } from '@builderbot/provider-meta'
    
    import { startInactividad, resetInactividad, stopInactividad,
    } from '../utils/idle'
import { flowLlamarMenu } from './flowLlamarMenu';
import { flowAyuda } from './flowAyuda';

    let errores = 0;
    

export const flowActividadesAdultos = addKeyword<Provider, Database>('actividades adultos mayores')   
        .addAnswer('Si querés sumarte a las actividades para adultos mayores, contame cual te interesa y te mando información 👇',
        {delay: 1000}, async (ctx, { provider, gotoFlow } ) => {
        startInactividad(ctx, gotoFlow, 160000); 

            })
        .addAnswer(['1. 👉 Ajedrez ♟️',
                    '2. 👉 Taller Cognitivo "Reactiva" 🧠',
                    '3. 👉 Folclore 💃',
                    '4. 👉 Cuerpo y movimiento 🤸‍♀️',
                    '5. 👉 Tejo 🥏',
                    '6. 👉 Yoga 🧘\n',
                    '7. 👉 Cambiar de tema 🔄'
                ],

                { delay: 3000, capture: true }, async (ctx, { fallBack, gotoFlow, flowDynamic  }) => {
        
                    const opcion = ctx.body.toLowerCase().trim();
        
                    if (!["1", "2", "3", "4", "5", "6", "7"].includes(opcion)) {
                        resetInactividad(ctx, gotoFlow, 90000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
                        await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");
                        
                    //    await fallBack();
                        errores++;
                    return gotoFlow(flowActividadesAdultos)
                    if (errores > 2 )
                    {
                        stopInactividad(ctx)
                        return gotoFlow(flowAyuda);
        
                    }
                   }
                else {
                   try {
                        stopInactividad(ctx)
                        if (opcion === '2'){
                                const consultados = await consultarDatos('2-1')
                                const Opcion = consultados['Opcion']
                                const Actividad = consultados['Actividad'] // Fecha y hora en una sola columna
                                const Dias = consultados['Dias']                        // AQUI DECLARAMOS LAS VARIABLES CON LOS DATOS QUE NOS TRAEMOS DE LA FUNCION         VVVVVVVVV
                                const Horario = consultados['Horario']
                                const Ubicacion = consultados['Ubicacion']
                                const Dicta = consultados['Dicta']
                                
                                await flowDynamic(`*${Actividad}*\n📆 ${Dias}\n⌚ ${Horario}\n📍 ${Ubicacion}\nDicta: ${Dicta}`)
                
                                const consultados2 = await consultarDatos('2-2')
                                const Opcion2 = consultados2['Opcion']
                                const Actividad2 = consultados2['Actividad'] // Fecha y hora en una sola columna
                                const Dias2 = consultados2['Dias']                        // AQUI DECLARAMOS LAS VARIABLES CON LOS DATOS QUE NOS TRAEMOS DE LA FUNCION         VVVVVVVVV
                                const Horario2 = consultados2['Horario']
                                const Ubicacion2 = consultados2['Ubicacion']
                                const Dicta2 = consultados2['Dicta']
                                
                                await flowDynamic(`*${Actividad2}*\n📆 ${Dias2}\n⌚ ${Horario2}\n📍 ${Ubicacion2}\nDicta: ${Dicta2}`)
                                await flowDynamic('Para participar, agenda día y horario y acercate directamente a la actividad 😊', {delay: 4000})
                                return gotoFlow(flowLlamarMenu)

                        }
                        else {
                                const consultados = await consultarDatos(opcion)
                                const Opcion = consultados['Opcion']
                                const Actividad = consultados['Actividad'] // Fecha y hora en una sola columna
                                const Dias = consultados['Dias']                        // AQUI DECLARAMOS LAS VARIABLES CON LOS DATOS QUE NOS TRAEMOS DE LA FUNCION         VVVVVVVVV
                                const Horario = consultados['Horario']
                                const Ubicacion = consultados['Ubicacion']
                                const Dicta = consultados['Dicta']
                                
                                await flowDynamic(`*${Actividad}*\n📆 ${Dias}\n⌚ ${Horario}\n📍 ${Ubicacion}\nDicta: ${Dicta}`)
                                await flowDynamic('Para participar, agenda día y horario y acercate directamente a la actividad 😊', {delay: 4000})
                                return gotoFlow(flowLlamarMenu)
                        
                        }
                      
                        
                    } catch (error) {
                        console.error('Error al manejar el caso de Teléfono indefinido:', error);
                        // Puedes manejar el error de la manera que prefieras
                    }
                }})

        async function consultarDatos(opcion){
                try {
                    await doc.loadInfo();
                    const sheet = doc.sheetsByTitle['Actividades-adultos-mayores'];                        // AQUÍ DEBES PONER EL NOMBRE DE TU HOJA  
                    const consultados = [];
                    const rows = await sheet.getRows();
                    for (let index = 0; index < rows.length; index++) {
                        const row = rows[index];
                        // Resto del código...
                      }
                    try {
                        for (let index = 0; index < rows.length; index++) {
                            const row = rows[index];
                            if (row && (row as any)._rawData[0] === opcion) {
                              consultados['Opcion'] = (row as any)._rawData[0];
                              consultados['Actividad'] = (row as any)._rawData[1];
                              consultados['Dias'] = (row as any)._rawData[2];
                              consultados['Horario'] = (row as any)._rawData[3];
                              consultados['Ubicacion'] = (row as any)._rawData[4];
                              consultados['Dicta'] = (row as any)._rawData[5];
                            }
                        }
                    }catch (error) {
                        console.error('Error al manejar el caso de Teléfono indefinido:', error);
                    }             
                return consultados
                } catch (error) {
                    console.error('Error al consultar datos:', error);
                    throw error; // Vuelve a lanzar el error para que pueda ser manejado más arriba
                }  
            }
