import express from 'express';
import {createRequest,getAllRequests, getRequestById, updateRequest, deleteRequest, completeRequest} from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/requests', createRequest);
app.get('/requests', getAllRequests);
app.get('/requests/:id', getRequestById);
app.put('/requests/:id', updateRequest);
app.delete('/requests/:id', deleteRequest);
app.post('/requests/:id/complete', completeRequest);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});