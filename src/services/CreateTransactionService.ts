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
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    console.log(title);
    console.log(category);

    // const balance = await transactionsRepository.getBalance();

    // if (type === 'outcome' && balance.total < value) {
    //   throw new AppError(
    //     'Você não tem dinheiro em caixa sufiente para realizar esta ação',
    //   );
    // }

    const checkCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    console.log(checkCategory);
    let newCategory;

    if (checkCategory) {
      throw new AppError('Category already used.');
    } else {
      newCategory = await categoriesRepository.create({
        title,
      });
      await categoriesRepository.save(newCategory);
    }

    console.log(newCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
