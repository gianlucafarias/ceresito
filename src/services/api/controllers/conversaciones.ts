import { getRepository } from 'typeorm';
import { Converstation } from '../entities/Conversation';
import { ServerResponse } from 'polka';

export const obtenerConversaciones = async (req, res: ServerResponse) => {
  try {
    const conversacionRepository = getRepository(Converstation);
    const conversaciones = await conversacionRepository.find();
    res.end(JSON.stringify(conversaciones));
  } catch (error) {
    console.error('Error al obtener las conversaciones:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Error al obtener las conversaciones' }));
  }
};