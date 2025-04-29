import { forwardRef, Module } from '@nestjs/common';
import { RegisterCounterService } from './register-counter.service';
import { SchedulerService } from './scheduler.service';
import { StocksModule } from '../stocks/stocks.module';
import { PaginationService } from './pagination.service';

@Module({
  imports: [forwardRef(() => StocksModule)],
  providers: [RegisterCounterService, SchedulerService, PaginationService],
  exports: [RegisterCounterService, SchedulerService, PaginationService],
})
export class CoreModule {}
