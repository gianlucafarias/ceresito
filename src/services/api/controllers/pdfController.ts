import { Request, Response } from 'express';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Aquí debes importar la función para obtener los datos del usuario desde la base de datos
// import { getUserData } from '../database';
interface UserData {
    name: string;
    lastName: string;
    documentNumber: string;
  }

  
export const modifyPdf = async (req: Request, res: Response) => {
  const { name, documentNumber } = req.body as UserData;

  // Aquí debes obtener los datos completos del usuario desde la base de datos
  const userData = {
    name: 'Juan Perez',
    documentNumber: '12345678',
  };

  try {
    // Cargar el archivo PDF original
    const pdfBytes = fs.readFileSync('src/media/certificado-congreso.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Obtener la primera página del PDF
    const page = pdfDoc.getPages()[0];

    // Obtener la fuente y el tamaño de fuente
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 18;

    // Modificar el contenido de la página
    const { width, height } = page.getSize();

    // Centrar el nombre horizontalmente
    const textWidth = font.widthOfTextAtSize(name, fontSize);
    const x = (width - textWidth) / 2;
    const y = height - 350;
    page.drawText(name, { x, y, size: fontSize, font });

    // Ajustar el tamaño de fuente para el DNI
    const dniSize = 14;
    page.drawText(documentNumber, { x: 415, y: height - 390, size: dniSize, font });

    // Serializar el PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();

    // Guardar el PDF modificado en el servidor
    const pdfPath = path.join(__dirname, '..', 'modified_certificates', `${Date.now()}.pdf`);

    fs.writeFileSync(pdfPath, modifiedPdfBytes);

    // Devolver la URL del PDF modificado
    res.json({ pdfUrl: `https://api.ceres.gob.ar/modified_certificates/${path.basename(pdfPath)}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al modificar el PDF' });
  }
};