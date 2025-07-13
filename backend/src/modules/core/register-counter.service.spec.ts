import { RegisterCounterService, CounterKeyEnum } from './register-counter.service';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    existsSync: jest.fn(),
    promises: {
      readFile: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});

describe('RegisterCounterService', () => {
  let service: RegisterCounterService;

  const mockFilePath = 'storage/registerMethodsCallCount.json';
  const mockFullPath = `${process.cwd()}/${mockFilePath}`;

  const mockCounters = {
    [CounterKeyEnum.STOCK]: 2,
    [CounterKeyEnum.CRYPTO]: 5,
  };

  beforeEach(() => {
    service = new RegisterCounterService();

    (service as any).counterFilePath = mockFullPath;
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockCounters));
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  it('should increment an existing counter', async () => {
    await service.incrementCounter(CounterKeyEnum.STOCK);
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      mockFullPath,
      JSON.stringify({ ...mockCounters, [CounterKeyEnum.STOCK]: 3 }, null, 2),
    );
  });

  it('should initialize and increment a non-existing counter', async () => {
    await service.incrementCounter(CounterKeyEnum.ETF);
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      mockFullPath,
      JSON.stringify({ ...mockCounters, [CounterKeyEnum.ETF]: 1 }, null, 2),
    );
  });

  it('should reset a counter to zero', async () => {
    await service.resetCounter(CounterKeyEnum.CRYPTO);
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      mockFullPath,
      JSON.stringify({ ...mockCounters, [CounterKeyEnum.CRYPTO]: 0 }, null, 2),
    );
  });

  it('should return the current counter value', async () => {
    const value = await service.getCounter(CounterKeyEnum.CRYPTO);
    expect(value).toBe(5);
  });

  it('should return 0 for missing counter key', async () => {
    const value = await service.getCounter(CounterKeyEnum.ETF);
    expect(value).toBe(0);
  });

  it('should create file if it does not exist in readCounters', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.promises.readFile as jest.Mock).mockResolvedValue('{}');

    const value = await service.getCounter(CounterKeyEnum.ETF);
    expect(fs.promises.writeFile).toHaveBeenCalledWith(mockFullPath, JSON.stringify({}));
    expect(value).toBe(0);
  });

  it('should handle JSON parse error in readCounters', async () => {
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('fail'));

    const result = await service.getCounter(CounterKeyEnum.STOCK);
    expect(loggerError).toHaveBeenCalledWith('Error reading counters file', expect.any(Error));
    expect(result).toBe(0);
  });

  it('should handle write error in writeCounters', async () => {
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('write fail'));

    await service.incrementCounter(CounterKeyEnum.CRYPTO);
    expect(loggerError).toHaveBeenCalledWith('Error writing counters file', expect.any(Error));
  });
});
