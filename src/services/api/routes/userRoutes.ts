import polka from 'polka';
import { getUsersCount, getInteractionsCountLastWeek } from '../controllers/userController';
import reclamosController from '../controllers/reclamosController';

const router = polka();

router.get('/reclamos/:id', reclamosController.getReclamoById);
router.put('/reclamos/:id', reclamosController.updateReclamo);
router.get('/users/count', getUsersCount);
router.get('/interactions/last-week/count', getInteractionsCountLastWeek);
router.get('/reclamos', reclamosController.getAllReclamos);

export default router;