import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as fs from 'fs';
import path from 'path';
import { CounterKeyEnum, RegisterCounterService } from 'src/modules/core/register-counter.service';
import { StocksService } from 'src/modules/stocks/stocks.service';

@Injectable()
export class SchedulerService {
  private readonly stockSymbolsFilePath = path.join(process.cwd(), 'scraped-s&p500stocks.json');
  private readonly progressIndexFilePath = path.join(process.cwd(), 'storage/progressIndex.json');
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly registerCounterService: RegisterCounterService,
    private readonly stocksService: StocksService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  // '30 21 * * *' --- everyday at 21:30
  // '0/5 * * * * *' --- every 5 seconds
  // @Cron('0/5 * * * * *', { name: 'processDailyStocks' })
  @Cron('30 21 * * *', { name: 'processDailyStocks' })
  async processDailyStocks() {
    try {
      const doesFileExits = fs.existsSync(this.stockSymbolsFilePath);
      if (!doesFileExits) {
        this.logger.error('No stoc symbols file found');
        this.schedulerRegistry.deleteCronJob('processDailyStocks');
        return;
      }
      const symbols = JSON.parse(fs.readFileSync(this.stockSymbolsFilePath, 'utf-8'));
      if (!symbols) {
        this.logger.error('No symbols found');
        this.schedulerRegistry.deleteCronJob('processDailyStocks');
        return;
      }

      let progressIndex = 0;

      if (fs.existsSync(path.join(process.cwd(), 'storage/progressIndex.json'))) {
        progressIndex = JSON.parse(fs.readFileSync(this.progressIndexFilePath, 'utf-8'));
      }

      // should be 10-20
      const batchSize = 10;
      const dailyRequestCounter = await this.registerCounterService.getCounter(
        CounterKeyEnum.STOCK,
      );
      if (dailyRequestCounter >= 20) {
        this.logger.error('Daily request limit reached');
        return;
      }

      const stockSymbols = symbols.slice(
        progressIndex,
        progressIndex + batchSize - dailyRequestCounter,
      );

      let newIndex = progressIndex + batchSize;
      if (newIndex >= symbols.length) {
        this.logger.log('All stocks processed');
        this.schedulerRegistry.deleteCronJob('processDailyStocks');
        fs.unlinkSync(this.progressIndexFilePath);
        return;
      }

      fs.writeFileSync(this.progressIndexFilePath, JSON.stringify(newIndex));

      this.logger.log(`Processing stocks ${progressIndex} - ${progressIndex + batchSize}`);

      //   await Promise.all(stockSymbols.map((symbol) => this.stocksService.processStock(symbol)));
    } catch (error) {
      this.logger.error('Error processing daily stocks', error);
    }
  }

  @Cron('35 21 * * *', { name: 'resetCountersDaily' })
  async resetCountersDaily() {
    await this.registerCounterService.resetCounter(CounterKeyEnum.STOCK);
    await this.registerCounterService.resetCounter(CounterKeyEnum.CRYPTO);
  }
}
