import { GoogleSpreadsheet } from 'google-spreadsheet'
import  fs  from 'fs'
import { JWT } from 'google-auth-library';
import moment from 'moment';  // Importar la biblioteca moment
import * as dotenv from 'dotenv';

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

async function cargarHoja() {

    await doc.loadInfo();
}

function obtenerFechaHoraActual() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

// Buscar nombre y teléfono en la hoja
export default async function consultarContactos(nombre, telefono) {
    await cargarHoja();
    const sheet = doc.sheetsByTitle['Usuarios']
    const rows = await sheet.getRows();
    console.log(rows)
    const consultados = {};
    let existe;
    // Buscar coincidencias en la columna Telefono
     // Buscar coincidencias en la columna Telefono
     const coincidencia = rows.filter(row => row.Telefono === telefono);

     if (coincidencia) {
        // Si hay coincidencia, retornar true
        return true;
    } else {
        // Si no hay coincidencia, agregar una nueva fila y retornar false
        await sheet.addRow({
            Nombre: nombre,
            Telefono: telefono,
            Registro: obtenerFechaHoraActual()
        });
        return false;
    }

}

