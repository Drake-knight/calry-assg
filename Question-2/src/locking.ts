import fs from 'fs/promises';

class FileLock {
  private lockFilePath: string; // path to the lock file 
  private retryInterval: number; // time to wait before retrying to acquire the lock
  private maxRetries: number; // maximum number of retries before giving up

  constructor(filePath: string, retryInterval = 500, maxRetries = 40) {
    this.lockFilePath = `${filePath}.lock`;
    this.retryInterval = retryInterval;
    this.maxRetries = maxRetries;
  }

  // Acquire the lock
  async acquire(): Promise<() => Promise<void>> {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        await fs.writeFile(this.lockFilePath, '', { flag: 'wx' }); // create the lock file
        return async () => {
          await this.release(); // release the lock
        };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, this.retryInterval)); // wait before retrying
        retries++;
      }
    }
    throw new Error('Failed to acquire lock');
  }

  // Release the lock
  private async release(): Promise<void> {
    try {
      await fs.unlink(this.lockFilePath); // delete the lock file
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

// Execute an operation with a file lock on the specified file
const withFileLock = async <T>(filePath: string, operation: () => Promise<T>): Promise<T> => {
  const lock = new FileLock(filePath);
  const release = await lock.acquire();
  // Execute the operation and release the lock after the operation is completed
  try {
    return await operation();
  } finally {
    await release();
  }
}

export { withFileLock , FileLock};
