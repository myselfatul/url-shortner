export function createUniqueId(
  machineId: number,
  datacenterId: number,
  epoch: number = 1609459200000,
): string {
  const machineIdBits = 5;
  const datacenterIdBits = 5;
  const sequenceBits = 12;

  const maxmachineId = (1 << machineIdBits) - 1;
  const maxDatacenterId = (1 << datacenterIdBits) - 1;
  const maxSequence = (1 << sequenceBits) - 1;

  const machineIdShift = sequenceBits;
  const datacenterIdShift = sequenceBits + machineIdBits;
  const timestampLeftShift = sequenceBits + machineIdBits + datacenterIdBits;

  if (machineId > maxmachineId || machineId < 0) {
    throw new Error(
      `Worker ID (${machineId}) out of bounds (0-${maxmachineId})`,
    );
  }
  if (datacenterId > maxDatacenterId || datacenterId < 0) {
    throw new Error(
      `Datacenter ID (${datacenterId}) out of bounds (0-${maxDatacenterId})`,
    );
  }

  let sequence = 0;
  let lastTimestamp = -1;

  function currentTimestamp(): number {
    return Date.now();
  }

  function waitForNextMillisecond(lastTimestamp: number): number {
    let timestamp = currentTimestamp();
    while (timestamp <= lastTimestamp) {
      timestamp = currentTimestamp();
    }
    return timestamp;
  }

  function generateId(): string {
    let timestamp = currentTimestamp();

    if (timestamp < lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate ID.');
    }

    if (timestamp === lastTimestamp) {
      sequence = (sequence + 1) & maxSequence;
      if (sequence === 0) {
        timestamp = waitForNextMillisecond(lastTimestamp);
      }
    } else {
      sequence = 0;
    }

    lastTimestamp = timestamp;

    const snowflakeId =
      (BigInt(timestamp - epoch) << BigInt(timestampLeftShift)) |
      (BigInt(datacenterId) << BigInt(datacenterIdShift)) |
      (BigInt(machineId) << BigInt(machineIdShift)) |
      BigInt(sequence);

    return snowflakeId.toString();
  }

  return generateId();
}
