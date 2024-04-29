import polka from 'polka';
import visitasFlujoController from '../controllers/visitasFlujoController';

const visitasFlowRouter = polka();
visitasFlowRouter.get('/visitas-flujo', visitasFlujoController.getVisitasFlujo);

export default visitasFlowRouter;