// just a test file to test the file locking mechanism
// run in multiple terminals to see the locking in action
import fs from 'fs/promises';
import path from 'path';
import { withFileLock } from '../locking';

const file = path.join(__dirname,'test.txt');
console.log('File path:', file);
async function testFileLock() {
  try {
    await withFileLock(file, async () => {
      console.log('Lock acquired by', process.pid);

      const data = await fs.readFile(file, 'utf8').catch(() => '');
      console.log('Data read by', process.pid);
      await fs.writeFile(file, data + `YO!! Process ${process.pid} wrote this line.\n`);

      console.log('File operation completed by', process.pid);
    
      await new Promise(resolve => setTimeout(resolve, 3000));
    });

    console.log('Lock released by', process.pid);
  } catch (error) {
    console.error('Failed to acquire lock:', error);
  }
}

testFileLock();