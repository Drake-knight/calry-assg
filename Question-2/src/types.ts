type RequestStatus = 'received' | 'in progress' | 'awaiting confirmation' | 'completed' | 'canceled';

interface ServiceRequest {
    id: string;
    guestName: string;
    roomNumber: number;
    requestDetails: string;
    priority: number;
    status: RequestStatus;
    isVIP: boolean;
    createdAt: number;
    updatedAt: number;
  }

  export { ServiceRequest, RequestStatus };