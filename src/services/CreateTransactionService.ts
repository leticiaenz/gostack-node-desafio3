import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'You do not have enough cash to carry out this action',
      );
    }

    let TransactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!TransactionCategory) {
      TransactionCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(TransactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: TransactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
