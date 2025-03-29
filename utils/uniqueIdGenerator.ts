class Snowflake {
  private workerId: number;
  private datacenterId: number;
  private epoch: number;
  private sequence: number;
  private lastTimestamp: number;

  private readonly workerIdBits = 5;
  private readonly datacenterIdBits = 5;
  private readonly sequenceBits = 12;

  private readonly maxWorkerId = (1 << this.workerIdBits) - 1;
  private readonly maxDatacenterId = (1 << this.datacenterIdBits) - 1;
  private readonly maxSequence = (1 << this.sequenceBits) - 1;

  private readonly workerIdShift = this.sequenceBits;
  private readonly datacenterIdShift = this.sequenceBits + this.workerIdBits;
  private readonly timestampLeftShift =
    this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

  constructor(
    workerId: number,
    datacenterId: number,
    epoch: number = 1609459200000,
  ) {
    // Epoch: Jan 1, 2021
    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error(
        `Worker ID (${workerId}) out of bounds (0-${this.maxWorkerId})`,
      );
    }
    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
      throw new Error(
        `Datacenter ID (${datacenterId}) out of bounds (0-${this.maxDatacenterId})`,
      );
    }

    this.workerId = workerId;
    this.datacenterId = datacenterId;
    this.epoch = epoch;

    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  private _currentTimestamp(): number {
    return Date.now();
  }

  private _waitForNextMillisecond(lastTimestamp: number): number {
    let timestamp = this._currentTimestamp();
    while (timestamp <= lastTimestamp) {
      timestamp = this._currentTimestamp();
    }
    return timestamp;
  }

  public generateId(): string {
    let timestamp = this._currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate ID.');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.maxSequence;
      if (this.sequence === 0) {
        timestamp = this._waitForNextMillisecond(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const snowflakeId = (
      (BigInt(timestamp - this.epoch) << BigInt(this.timestampLeftShift)) |
      (BigInt(this.datacenterId) << BigInt(this.datacenterIdShift)) |
      (BigInt(this.workerId) << BigInt(this.workerIdShift)) |
      BigInt(this.sequence)
    ).toString();

    return snowflakeId;
  }
}
