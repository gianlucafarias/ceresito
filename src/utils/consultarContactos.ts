import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import { JWT } from 'google-auth-library';
import moment from 'moment';

const RESPONSES_SHEET_ID = process.env.RESPONSES_SHEET_ID;
const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json', 'utf-8'));
const serviceAccountAuth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

function obtenerFechaHoraActual() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

async function buscarNumeroTelefono(telefono) {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Usuarios'];
    const rows = await sheet.getRows();
    const headers = sheet.headerValues;
    const telefonoColumnIndex = headers.indexOf('Telefono');

    for (const row of rows) {
      const telefonoEnFila = row._rawData[telefonoColumnIndex];

      if (telefonoEnFila === telefono) {
        return row;
      }
    }

    return undefined;
  } catch (error) {
    console.error('Error al buscar número de teléfono:', error);
    throw error;
  }
}

export default async function consultarContactos(nombre, telefono) {
  try {
    const rowExistente = await buscarNumeroTelefono(telefono);

    if (rowExistente) {
      console.log('El numero se encuentra registrado');
      return true;
    } else {
      console.log('Nuevo Numero');
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['Usuarios'];
      await sheet.addRow({ Nombre: nombre, Telefono: telefono, Registro: obtenerFechaHoraActual() });
      return false;
    }
  } catch (error) {
    console.error('Error al consultar datos:', error);
    throw error;
  }
}