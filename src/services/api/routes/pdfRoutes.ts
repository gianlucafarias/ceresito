import polka from 'polka';
import { modifyPdf } from '../controllers/pdfController';

const router = polka();
router.post('/crear-certificado', modifyPdf);

export default router;