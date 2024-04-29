import polka from 'polka';
import reclamosController from '../controllers/reclamosController';

const router = polka();

router.get('/reclamos', reclamosController.getAllReclamos);
router.get('/reclamos/:id', reclamosController.getReclamoById);
router.put('/reclamos/:id', reclamosController.updateReclamo);
router.delete('/reclamos/:id', reclamosController.deleteReclamo);

export default router;