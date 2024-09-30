import { readData } from './dataAccess';
import { ServiceRequest } from './types';

const generatedIds = new Set<string>();

const generateCustomId =  async (): Promise<string> =>{
  const data: ServiceRequest[] = await readData();
  let id: string;
  do {
    id = 'CALRY' + Math.floor(10000 + Math.random() * 90000).toString();
  } while (data.some(request => request.id === id) || generatedIds.has(id));
  generatedIds.add(id);
  return id;
}

export { generateCustomId };