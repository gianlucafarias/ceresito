import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import { JWT } from 'google-auth-library';

const RESPONSES_SHEET_ID = process.env.RESPONSES_SHEET_ID;
const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json', 'utf-8'));
const serviceAccountAuth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

export async function getUsuariosDesdeSheets() {
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['Hoja 5'];
        const rows = await sheet.getRows();
        console.log(rows)
    return rows.map((row) => [row._rawData['Nombre'], row._rawData['Telefono']]);
  }
  
  // Función para enviar mensajes a los usuarios
  export async function enviarMensajesAUsuarios(usuarios: string[][]) {
    for (const [nombre, telefono] of usuarios) {
      const mensaje = `Hola ${nombre}! Soy Ceresito y quería contarte que volví a estar activo.`;
  
      try {
        await fetch(' https://aa21-170-247-77-30.ngrok-free.app/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: telefono,
            message: mensaje,
            urlMedia: ""
          }),
        });
  
        console.log(`Mensaje enviado a ${nombre} (${telefono})`);
      } catch (error) {
        console.error(`Error al enviar mensaje a ${nombre} (${telefono}):`, error);
      }
    }
  }
  
  // Ejemplo de uso
  (async () => {
    const usuarios = await getUsuariosDesdeSheets();
    await enviarMensajesAUsuarios(usuarios);
  })();