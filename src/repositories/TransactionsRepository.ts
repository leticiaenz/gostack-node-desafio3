import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

const typeIncome = 'income';
const typeOutcome = 'outcome';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // const transactions = await this.find();
    // let income = 0;
    // let outcome = 0;
    // transactions.map((item: Transaction) => {
    //   if (item.type === typeIncome) {
    //     income += item.value;
    //   } else if (item.type === typeOutcome) {
    //     outcome += item.value;
    //   }
    //   return {
    //     income,
    //     outcome,
    //     total: income - outcome,
    //   };
    // });
  }
}

export default TransactionsRepository;
