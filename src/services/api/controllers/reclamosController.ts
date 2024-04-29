import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Reclamo } from '../entities/Reclamo';

const reclamosController = {
  async getAllReclamos(req: Request, res: Response) {
    try {
      const reclamoRepository = getRepository(Reclamo);
      const reclamos = await reclamoRepository.find();
      res.json(reclamos);
    } catch (error) {
      console.error('Error al obtener los reclamos:', error);
      res.status(500).json({ error: 'Error al obtener los reclamos' });
    }
  },

  async getReclamoById(req: Request, res: Response) {
    const { id } = req.params;
    const reclamoRepository = getRepository(Reclamo);

    try {
      const reclamo = await reclamoRepository.findOne({ where: { id: parseInt(id, 10) } });
      if (reclamo) {
        res.json(reclamo);
      } else {
        res.status(404).json({ message: 'Reclamo no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener el reclamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async updateReclamo(req: Request, res: Response) {
    const { id } = req.params;
    const { estado } = req.body;

    const reclamoRepository = getRepository(Reclamo);

    try {
      const reclamo = await reclamoRepository.findOne({ where: { id: parseInt(id, 10) } });

      if (reclamo) {
        reclamo.estado = estado;
        await reclamoRepository.save(reclamo);
        res.json({ message: 'Estado del reclamo actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Reclamo no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el estado del reclamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  async deleteReclamo(req: Request, res: Response) {
    const { id } = req.params;

    const reclamoRepository = getRepository(Reclamo);

    try {
      const reclamo = await reclamoRepository.findOne({ where: { id: parseInt(id, 10) } });

      if (reclamo) {
        await reclamoRepository.remove(reclamo);
        res.json({ message: 'Reclamo eliminado exitosamente' });
      } else {
        res.status(404).json({ message: 'Reclamo no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar el reclamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

};

export default reclamosController;