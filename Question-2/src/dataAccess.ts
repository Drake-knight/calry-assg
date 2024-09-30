import fs from 'fs/promises';
import path from 'path';
import { ServiceRequest } from './types';
import { withFileLock } from './locking';

// path to the data file
const file = path.join(__dirname, '..', 'data', 'requests.json');


// Read data from the file
const readData =  async (): Promise<ServiceRequest[]> => {
  // Acquire a lock on the data file before reading from it
  return withFileLock(file, async () => {
    try {
      const data = await fs.readFile(file, 'utf8');
      if(!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read data:', error);
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw error;
    }
  });
}

// Write data to the file
const writeData = async (data: ServiceRequest[]): Promise<void>=>{
  // Acquire a lock on the data file before writing to it
  return withFileLock(file, async () => {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  });
}

// first sort by active status, then by VIP status, then by priority(lower the number higher the priority), then by createdAt
const comparator = (a: ServiceRequest, b: ServiceRequest): number => {
  if (a.status === 'completed' && b.status !== 'completed') return 1;
  if (a.status !== 'completed' && b.status === 'completed') return -1;
  if (a.isVIP && !b.isVIP) return -1;
  if (!a.isVIP && b.isVIP) return 1;
  if (a.priority > b.priority) return 1;
  if (a.priority < b.priority) return -1;
  if (a.createdAt < b.createdAt) return -1;
  if (a.createdAt > b.createdAt) return 1;
  return 0;
}

const sortRequests = (requests: ServiceRequest[]): ServiceRequest[] =>{
  return requests.sort(comparator);
}

export { readData, writeData, sortRequests };