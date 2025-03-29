import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as fs from 'fs';
import path from 'path';
import { StocksService } from 'src/modules/stocks/stocks.service';

@Injectable()
export class SchedulerService {
  private readonly sotckSymbolsFilePath = path.join(process.cwd(), 'scraped-s&p500stocks.json');
  private readonly progressIndexFilePath = path.join(process.cwd(), 'progressIndex.json');
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly stocksService: StocksService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron('0/5 * * * * *', { name: 'processDailyStocks' })
  async processDailyStocks() {
    try {
      const symbols = JSON.parse(fs.readFileSync(this.sotckSymbolsFilePath, 'utf-8'));

      if (!symbols) {
        this.logger.error('No file found');
        this.schedulerRegistry.deleteCronJob('processDailyStocks');
      }

      let progressIndex = 0;

      if (fs.existsSync(path.join(process.cwd(), 'progressIndex.json'))) {
        progressIndex = JSON.parse(fs.readFileSync(this.progressIndexFilePath, 'utf-8'));
      }

      const batchSize = 100;
      const stockSymbols = symbols.slice(progressIndex, progressIndex + batchSize);

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
}
