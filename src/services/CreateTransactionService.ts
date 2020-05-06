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
        'Você não tem dinheiro em caixa sufiente para realizar esta ação',
      );
    }

    let TransactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!TransactionCategory) {
      TransactionCategory = await categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(TransactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: TransactionCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
