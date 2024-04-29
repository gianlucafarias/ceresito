import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Contact } from '../entities/Contact';
import { History } from '../entities/History';

export const getUsersCount = async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(Contact);
    const usersCount = await userRepository.createQueryBuilder().getCount();
    res.json({ count: usersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getInteractionsCountLastWeek = async (req: Request, res: Response) => {
  try {
    const historyRepository = getRepository(History);
    const interactionsCount = await historyRepository
      .createQueryBuilder()
      .where('created_at >= CURRENT_DATE - INTERVAL \'7 days\'')
      .getCount();
    res.json({ count: interactionsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
