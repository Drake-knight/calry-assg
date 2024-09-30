import { Request, Response } from 'express';
import { ServiceRequest } from './types';
import { readData, writeData, sortRequests } from './dataAccess';
import { generateCustomId } from './generateId';

const createRequest = async (req: Request, res: Response) => {
  try {
    const { guestName, roomNumber, requestDetails, priority, isVIP } = req.body;

    if (!guestName || !roomNumber || !requestDetails || !priority) {
      res.status(400).json({ error: 'Missing required fields' });
    }

    const newRequest: ServiceRequest = {
      id: await generateCustomId(),
      guestName,
      roomNumber,
      requestDetails,
      priority,
      status: 'received',
      isVIP: isVIP || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const data = await readData();

    data.push(newRequest);

    await writeData(data);
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const data = await readData();

    const sortedData = sortRequests(data);

    res.status(200).json(sortedData);
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const getRequestById =  async  (req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      res.status(400).json({ error: 'Request ID is required' });
    }

    const data = await readData();

    const request = data.find((r) => r.id === req.params.id);

    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const updateRequest =  async(req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      res.status(400).json({ error: 'Request ID is required' });
    }

    const data = await readData();

    const index = data.findIndex((r) => r.id === req.params.id);

    if (index !== -1) {
      const updatedRequest = { ...data[index], ...req.body, updatedAt: Date.now() };
      data[index] = updatedRequest;

      await writeData(data);

      res.status(200).json(updatedRequest);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const deleteRequest =  async  (req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      res.status(400).json({ error: 'Request ID is required' });
    }

    const data = await readData();

    const index = data.findIndex((r) => r.id === req.params.id);

    if (index !== -1) {
      const request = data[index];
      if (request.status === 'completed' || request.status === 'canceled') {
        data.splice(index, 1);

        await writeData(data);

        res.status(204);
      } else {
        res.status(400).json({ error: 'Request must be completed or canceled to delete' });
      }
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const completeRequest = async (req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      res.status(400).json({ error: 'Request ID is required' });
    }

    const data = await readData();

    const index = data.findIndex((r) => r.id === req.params.id);

    if (index !== -1) {
      data[index].status = 'completed';
      
      data[index].updatedAt = Date.now();

      await writeData(data);

      res.status(200).json(data[index]);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === 'File not found') {
      res.status(404).json({ error: 'Data file not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export { createRequest, getAllRequests, getRequestById, updateRequest, deleteRequest, completeRequest };