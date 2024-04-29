import { GoogleSpreadsheet } from 'google-spreadsheet'
import  fs  from 'fs'
import { JWT } from 'google-auth-library';
import { addKeyword } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import axios from 'axios';

const RESPONSES_SHEET_ID = process.env.RESPONSES_SHEET_ID
const CREDENTIALS = JSON.parse(fs.readFileSync('./credenciales.json', 'utf-8'));
const API_URL = 'https://api.ceres.gob.ar/api/crear-certificado'; // URL de tu API para crear certificados
let CertificadoUrl;
const serviceAccountAuth = new JWT({
    email: CREDENTIALS.client_email,
    key: CREDENTIALS.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);

export const flowCertificado = addKeyword<Provider, Database>(['generar certificado'])
.addAnswer('Enviame tu numero de documento. Si estás inscripta al Congreso te generaré un certificado.')
.addAction({capture: true, delay: 2000}, async (ctx, { flowDynamic, provider }) => {
    const dni = ctx.body;
    CertificadoUrl = await consultarDatos(dni)
    console.log(CertificadoUrl)

    if (CertificadoUrl === null) {
        provider.sendText(ctx.from, 'Lo siento, tu DNI no se encuentra inscripto en el Congreso.');
      } else {
        provider.sendMedia(ctx.from, 'Te envío tu certificado', CertificadoUrl);
      }
    });

async function consultarDatos(dni) {
    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['Certificados'];
        const rows = await sheet.getRows();

        for (const row of rows) {
            const dniEnFila = row._rawData[2];
            if (dniEnFila === dni) {
                const certificado = row._rawData['Certificado'];
                if (certificado === undefined || certificado === '') {
                    const nombre = row._rawData[0];
                    const pdfUrl = await crearCertificado(nombre, dni);
                    return pdfUrl; // Devuelve la URL del certificado
                } else {
                    console.log('El usuario ya tiene un certificado.');
                    return certificado; // Devuelve la URL del certificado existente
                }
            }
        }
        console.log('No se encontró el DNI en la hoja de cálculo.');
        return null; // Devuelve null si el DNI no se encontró en la hoja de cálculo
    } catch (error) {
        console.error('Error al consultar datos:', error);
        throw error;
    }
}
async function crearCertificado(nombre, dni) {
    try {
      const certificadoResponse = await axios.post(API_URL, {
        name: nombre,
        documentNumber: dni,
      });
      const pdfUrl = certificadoResponse.data.pdfUrl;
      CertificadoUrl = pdfUrl;
      console.log('URL del certificado:', CertificadoUrl);
  
      // Cargar la hoja de cálculo
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['Certificados'];
      const rows = await sheet.getRows();
  
      // Buscar la fila correspondiente al usuario
      for (const row of rows) {
        const dniEnFila = row._rawData[2];
        if (dniEnFila === dni) {
          // Actualizar la columna "Certificado" con la URL del certificado
          row._rawData[3] = CertificadoUrl;
          await row.save();
          console.log('Certificado almacenado en la hoja de cálculo.');
          return pdfUrl; // Devolver la URL del certificado
        }
      }
      console.log('No se encontró el DNI en la hoja de cálculo.');
      return pdfUrl; // Devolver la URL del certificado
    } catch (error) {
      console.error('Error al crear el certificado:', error);
      throw error;
    }
  }




