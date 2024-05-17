import { GoogleSpreadsheet } from 'google-spreadsheet'
import  fs  from 'fs'
import { JWT } from 'google-auth-library';
import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import { startInactividad, resetInactividad, stopInactividad,
} from '../utils/idle'
import { flowAyuda } from './flowAyuda';
import { flowLlamarMenu } from './flowLlamarMenu';


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
let inscripcion;
const STATUS = {}
let tieneImagen = false;
let telefono;

export const flowInscripcionPoda = addKeyword<Provider, Database>('inscripcion plan de poda')
.addAnswer(['¡Perfecto! Para inscribirte en el Registro de poda 2024 voy a pedirte lo siguiente:👇\n',
            'Nombre y apellido',
            'Dirección ',
            'Barrio',
            'Una foto (opcional)'])

            .addAnswer(
                '¿Podes decirme tu Nombre completo?',
                {capture:true},
                async (ctx,{gotoFlow, flowDynamic}) =>{
                resetInactividad(ctx, gotoFlow, 300000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
                telefono = ctx.from
                STATUS[telefono] = {...STATUS[telefono], nombre : ctx.body}
                STATUS[telefono] = {...STATUS[telefono], telefono : ctx.from}

            })
            .addAnswer(
                '¿Podes decirme donde está ubicado? Escribí en un mensaje el nombre de la calle y la dirección (Ejemplo: Av. H. Yrigoyen 04)',
                {capture:true},
                async (ctx,{gotoFlow, flowDynamic}) =>{
                resetInactividad(ctx, gotoFlow, 300000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
                telefono = ctx.from
                STATUS[telefono] = {...STATUS[telefono], ubicacion : ctx.body}
            })
            .addAnswer(
                '¿Podes especificarme en que barrio se encuentra? Escribí en un mensaje el nombre del barrio (Ejemplo: Barrio Belgrano)',
                {capture:true},
                async (ctx,{flowDynamic, gotoFlow, provider}) =>{
                resetInactividad(ctx, gotoFlow, 600000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
                const telefono = ctx.from
                STATUS[telefono] = {...STATUS[telefono], barrio : ctx.body}})
                .addAnswer(
                    'Por último, ¿podés enviarme una imagen? Si estás en el lugar o tenes una foto, seleccioná la primer opcion. Si no tenes una foto a mano, no hay problema 🙌',
                    {buttons:
                       [
                            { body: 'Si' },
                            { body: 'No tengo imagen' }
                        ]
                    })
            .addAction({ capture: true }, async (ctx, { provider, flowDynamic, gotoFlow, fallBack }) => {
                resetInactividad(ctx, gotoFlow, 300000); // ⬅️⬅️⬅️  REINICIAMOS LA CUENTA ATRÁS
                const opcion = ctx.body.toLowerCase().trim();
                console.log(opcion)
                    if (!['si', 'no tengo imagen', 'menu', 'menú'].includes(opcion)) {
                            errores++;
                            resetInactividad(ctx, gotoFlow, 90000)
                                if (errores > 2 )
                                {
                                    stopInactividad(ctx)
                                    return gotoFlow(flowAyuda);
                    
                                }
                            await flowDynamic('No te entiendo 😢 Necesitas ayuda? Escribí la palabra *Menú* para volver a empezar')
                        }
                        switch (opcion) {
                            case 'si': 
                                        {
                                        await flowDynamic('Perfecto, espero tu imagen. Te doy un tiempo si tenes que ir a sacarla.')
                                        tieneImagen = true;
                                        break;
                                    }
                            case 'no tengo imagen':
                                
                                    await flowDynamic('Perfecto, ¡no hay problema!')
                                    STATUS[telefono] = {...STATUS[telefono], imagen : 'No'}
                                    ingresarDatos();  
                                    await flowDynamic (['Espero que te haya parecido sencillo el formulario 😁', ])
                                    stopInactividad(ctx)
                                    return gotoFlow(flowLlamarMenu)         
                                    break;
                                
                            }
                        })
            .addAction({capture: true}, async (ctx, { provider, flowDynamic, gotoFlow, fallBack }) => {
                if(tieneImagen === true){
                    telefono = ctx.from
                    const localPath = await provider.saveFile(ctx, {path:'src/media/poda'})

                    console.log(localPath)
                    const imagePath = localPath.substring(localPath.indexOf('/poda/'));
                    const imageUrl = `https://api.ceres.gob.ar/api${imagePath}`;
                    console.log(imagePath)
                    console.log(imageUrl)
                    STATUS[telefono] = {...STATUS[telefono], imagen : imageUrl}
                }
                ingresarDatos();  
                await flowDynamic(`*Nombre*: ${STATUS[telefono].nombre}\n- *Ubicación*: ${STATUS[telefono].ubicacion}\n- *Barrio*: ${STATUS[telefono].barrio}\n`)
                await flowDynamic (['Espero que te haya parecido sencillo el formulario 😁', ], {delay:4000})
                                    stopInactividad(ctx)
                                    return gotoFlow(flowLlamarMenu)             
                
                
            })

            async function ingresarDatos(){
                const now = new Date(); // Obtener la fecha y hora actual
                const fechaHora = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                STATUS[telefono] = {...STATUS[telefono], fecha : fechaHora}
                const rows = [{
               // Ejemplo: // CABECERA DE SHEET : VARIABLE        //                             ➡️   Paso 3 - Aquí añades las variables creadas
                Fecha: STATUS[telefono].fecha, // Fecha y hora en una sola columna
                Nombre: STATUS[telefono].nombre,
                Telefono: STATUS[telefono].telefono,
                Ubicacion: STATUS[telefono].ubicacion,
                Barrio: STATUS[telefono].barrio,
                Imagen: STATUS[telefono].imagen
                }];
                await doc.loadInfo();
                const sheet = doc.sheetsByIndex[7];
                for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                await sheet.addRow(row);}
            }

            