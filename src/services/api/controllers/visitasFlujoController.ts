import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Flow } from '../entities/Flow';

const visitasFlujoController = {
  async getVisitasFlujo(req: Request, res: Response) {
    try {
      // Obtener datos de visitas de los flujos
      const visitasFlujoRepository = getRepository(Flow);
      const visitasFlujo = await visitasFlujoRepository.find();

      // Calcular la suma total de visitas de los flujos
      const totalVisitas = visitasFlujo.reduce((total, flujo) => total + flujo.contador, 0);

      // Devolver los datos y el total como una respuesta JSON
      res.json({ visitasFlujo, totalVisitas });
    } catch (error) {
      console.error('Error al obtener los datos de visitas de flujo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

export default visitasFlujoController;