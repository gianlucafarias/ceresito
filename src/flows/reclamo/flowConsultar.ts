import { GoogleSpreadsheet } from 'google-spreadsheet'
import  fs  from 'fs'
import { JWT } from 'google-auth-library';
import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { flowLlamarMenu } from '../flowLlamarMenu';


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

export const flowConsultar = addKeyword<Provider, Database>(['Consultar mis datos','🔍 Consultar mis datos 🔍'])
.addAnswer(['Dame unos segundos, estoy buscando tus datos dentro del sistema... 🔍'],{delay:6000}, async (ctx, {flowDynamic, gotoFlow, provider}) =>{

try {
    const telefono = ctx.from
    console.log(telefono)
    const consultados = await consultarDatos(telefono)

    
    if (consultados === undefined) {
        await flowDynamic(`No encontré solicitudes registradas con tu número de teléfono.`, { delay: 2000 });
        return gotoFlow(flowLlamarMenu);
    }
    const Fecha = consultados['Fecha'] // Fecha y hora en una sola columna
    const Reclamo = consultados['Reclamo']                        // AQUI DECLARAMOS LAS VARIABLES CON LOS DATOS QUE NOS TRAEMOS DE LA FUNCION         VVVVVVVVV
    const Ubicacion = consultados['Ubicacion']
    const Barrio = consultados['Barrio']
    const Telefono = consultados['Telefono']
    const Estado = consultados['Estado']

    await flowDynamic(`RECLAMO REALIZADO EL  ${Fecha}\n\n *Reclamo*: ${Reclamo}\n- *Ubicación*: ${Ubicacion}\n- *Barrio*: ${Barrio}\n- *Estado del reclamo*: ${Estado}`)
    if (Estado == 'PENDIENTE')
            {
                await flowDynamic(`El estado de tu solicitud es *PENDIENTE*. Hemos cargado tu reclamo en nuestra base de datos y está pendiente a aprobación. Recordá que completar tu solicitud puede llevar un tiempo.`), {delay:2000}   
                return gotoFlow(flowLlamarMenu)  
            }
            else if (Estado == 'COMPLETADO')
            {
                await flowDynamic(`El estado de tu solicitud es *COMPLETADO*. Resolvimos tu solicitud.`)
                return gotoFlow(flowLlamarMenu)  
            }
} catch (error) {
    console.error('Error al manejar el caso de Teléfono indefinido:', error);
    // Puedes manejar el error de la manera que prefieras
}

})
/////////////////////       ESTA FUNCION CONSULTA LOS DATOS DE UNA FILA !SEGÚN EL TELÉFONO!    ////////////////////////
async function consultarDatos(telefono){
    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['Hoja 1'];
        const rows = await sheet.getRows();

        for (const row of rows) {
            const telefonoEnFila = row._rawData[5]; // Acceder al teléfono por índice numérico
            console.log(telefonoEnFila)
            const telefonoAComparar = telefono;

            if (telefonoEnFila === telefonoAComparar) {
                const consultados = {
                    Fecha: row._rawData[0],
                    Reclamo: row._rawData[2],
                    Ubicacion: row._rawData[3],
                    Barrio: row._rawData[4],
                    Telefono: row._rawData[5],
                    Estado: row._rawData[6]
                };
                return consultados;
            }
        }
    } catch (error) {
        console.error('Error al consultar datos:', error);
        throw error;
    }
    return undefined;

    
}