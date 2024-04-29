import polka from 'polka';
import { obtenerConversaciones } from '../controllers/conversaciones';

const conversacionesRouter = polka();
conversacionesRouter.get('/conversaciones', obtenerConversaciones);

export default conversacionesRouter;