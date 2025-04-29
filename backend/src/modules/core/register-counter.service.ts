import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RegisterCounterService {
  private readonly logger = new Logger(RegisterCounterService.name);
  private readonly counterFilePath = path.join(
    process.cwd(),
    'storage/registerMethodsCallCount.json',
  );

  async incrementCounter(key: string): Promise<void> {
    const counters = await this.readCounters();
    counters[key] = (counters[key] || 0) + 1;
    await this.writeCounters(counters);
  }

  async resetCounter(key: string): Promise<void> {
    const counters = await this.readCounters();
    counters[key] = 0;
    await this.writeCounters(counters);
  }

  async getCounter(key: string): Promise<number> {
    const counters = await this.readCounters();
    return counters[key] || 0;
  }

  private async readCounters(): Promise<Record<string, number>> {
    try {
      if (!fs.existsSync(this.counterFilePath)) {
        await fs.promises.writeFile(this.counterFilePath, JSON.stringify({}));
      }
      const data = await fs.promises.readFile(this.counterFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error('Error reading counters file', error);
      return {};
    }
  }

  private async writeCounters(counters: Record<string, number>): Promise<void> {
    try {
      await fs.promises.writeFile(this.counterFilePath, JSON.stringify(counters, null, 2));
    } catch (error) {
      this.logger.error('Error writing counters file', error);
    }
  }
}
