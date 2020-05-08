import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

// interface Request {
//   id: 'string';
// }

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.findOne(id);
    console.log(id);
    if (!transactions) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.remove(transactions);
  }
}

export default DeleteTransactionService;
