import { GoogleSpreadsheet } from 'google-spreadsheet'
import  fs  from 'fs'
import { JWT } from 'google-auth-library';
import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'

import * as dotenv from 'dotenv';
import { flowAyuda } from './flowAyuda';
import { flowLlamarMenu } from './flowLlamarMenu';
import { flowConsultar } from './reclamo/flowConsultar';

dotenv.config();
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

let errores = 0;
let reclamo;
const STATUS = {}

export const flowCrearReclamo = addKeyword<Provider, Database>(['005','console'])
.addAction(async (ctx, { gotoFlow }) => {
    /*
    const adapterDB = require('../database/database')

    adapterDB.contadorFlujos(11) // reclamo
        .then(() => {
            console.log('Contador del flujo incrementado correctamente');
        })
        .catch((error) => {
            console.error('Error al incrementar el contador del flujo:', error);
        });
        */
    startInactividad(ctx, gotoFlow, 300000)
  })  
.addAnswer(['Contame, ¿Que tipo de Reclamo es?\n',
'1. 👉 Higiene urbana 🗑',
'2. 👉 Árboles 🌳',
'3. 👉 Arreglos 🚧',
'4. 👉 Consultar solicitud',

'\n\n Escribí el número del menú sobre el tema que te interese para continuar.',
],
{capture:true},
async (ctx,{flowDynamic, gotoFlow}) =>{
const telefono = ctx.from
const option = ctx.body.toLowerCase().trim();

if (!["1", "2", "3", "4"].includes(option)) {
    resetInactividad(ctx, gotoFlow, 300000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
    await flowDynamic("⚠️ Opción no encontrada, por favor seleccione una opción válida.");

    errores++;

if (errores > 2 )
{
    stopInactividad(ctx)
    return gotoFlow(flowAyuda);

}
    return;
}
switch (option)
{
    case '1': STATUS[telefono] = { ...STATUS[telefono], reclamo: 'Higiene Urbana', telefono: ctx.from };
    break;
    case '2': reclamo = 'Arboles'                //➡️ Variable del STATUS
    STATUS[telefono] = { ...STATUS[telefono], reclamo, telefono: ctx.from };
    break;
    case '3': reclamo = 'Arreglos'                //➡️ Variable del STATUS
    STATUS[telefono] = { ...STATUS[telefono], reclamo, telefono: ctx.from };
    break;
    case '4': return gotoFlow(flowConsultar)
}                     
console.log(STATUS[telefono])
                                                           // Ejemplo // NOMBRE VARIABLE = TATUS[telefono], NOMBRE VARIABLE : ctx.body

})
.addAnswer(
'¿Podes decirme donde está ubicado?',
{capture:true},
async (ctx,{gotoFlow, flowDynamic}) =>{
resetInactividad(ctx, gotoFlow, 300000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
const telefono = ctx.from
STATUS[telefono] = {...STATUS[telefono], ubicacion : ctx.body}
STATUS[telefono] = {...STATUS[telefono], nombre : ctx.pushName}
})
.addAnswer(
'¿Podes especificarme en que barrio se encuentra?',
{capture:true},
async (ctx,{flowDynamic, gotoFlow, provider}) =>{


const telefono = ctx.from
STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}      //Variable del STATUS

           //Variable del STATUS
/////////////////////       ESTA FUNCION AÑADE UNA FILA A SHEETS    /////////////////////////
   ingresarDatos();  
   async function ingresarDatos(){
    const now = new Date(); // Obtener la fecha y hora actual
    const fechaHora = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    STATUS[telefono] = {...STATUS[telefono], fecha : fechaHora}
    const rows = [{
   // Ejemplo: // CABECERA DE SHEET : VARIABLE        //                             ➡️   Paso 3 - Aquí añades las variables creadas
    Fecha: STATUS[telefono].fecha, // Fecha y hora en una sola columna
    Nombre: STATUS[telefono].nombre,
    Reclamo: STATUS[telefono].reclamo,    
    Ubicacion: STATUS[telefono].ubicacion,
    Barrio: STATUS[telefono].barrio,
    Telefono: STATUS[telefono].telefono,
    Estado: 'PENDIENTE'
   
        }];
   
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            await sheet.addRow(row);}
}

await flowDynamic (['Perfecto, espero que te haya parecido sencillo el formulario 😁', 
                    'Podes consultar el estado de tu reclamo en el menú de Reclamos.'], {delay:4000})
                    stopInactividad(ctx)
                    return gotoFlow(flowLlamarMenu)             
}

);
