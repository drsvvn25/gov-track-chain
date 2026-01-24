// Blockchain interaction utilities
// This simulates blockchain for demo - replace with real ethers.js connection

export type RequestStatus = 'Pending' | 'InProgress' | 'Completed';

export interface ServiceRequest {
  id: number;
  citizen: string;
  service: string;
  description: string;
  timestamp: number;
  status: RequestStatus;
  txHash: string;
}

// Simulated blockchain storage (in real app, this comes from smart contract)
let requestCount = 0;
const requests: Map<number, ServiceRequest> = new Map();

// Generate fake transaction hash
const generateTxHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate fake wallet address
export const generateWalletAddress = () => {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Simulate wallet connection
export const connectWallet = async (): Promise<string> => {
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if MetaMask is available
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts[0];
    } catch (error) {
      console.log('MetaMask connection failed, using demo mode');
    }
  }
  
  // Return demo wallet if MetaMask not available
  return generateWalletAddress();
};

// Create a new service request (simulates smart contract call)
export const createRequest = async (
  citizenAddress: string,
  service: string,
  description: string
): Promise<ServiceRequest> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate blockchain delay
  
  requestCount++;
  const request: ServiceRequest = {
    id: requestCount,
    citizen: citizenAddress,
    service,
    description,
    timestamp: Date.now(),
    status: 'Pending',
    txHash: generateTxHash(),
  };
  
  requests.set(requestCount, request);
  
  // Save to localStorage for persistence
  saveToStorage();
  
  return request;
};

// Get request by ID
export const getRequest = async (id: number): Promise<ServiceRequest | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  loadFromStorage();
  return requests.get(id) || null;
};

// Get all requests
export const getAllRequests = async (): Promise<ServiceRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  loadFromStorage();
  return Array.from(requests.values()).sort((a, b) => b.timestamp - a.timestamp);
};

// Update request status (admin only)
export const updateRequestStatus = async (
  id: number, 
  status: RequestStatus
): Promise<ServiceRequest | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  loadFromStorage();
  
  const request = requests.get(id);
  if (request) {
    request.status = status;
    request.txHash = generateTxHash(); // New transaction for status update
    requests.set(id, request);
    saveToStorage();
    return request;
  }
  return null;
};

// Get requests by citizen address
export const getRequestsByCitizen = async (address: string): Promise<ServiceRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  loadFromStorage();
  return Array.from(requests.values())
    .filter(r => r.citizen.toLowerCase() === address.toLowerCase())
    .sort((a, b) => b.timestamp - a.timestamp);
};

// Storage helpers
const saveToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('governance_requests', JSON.stringify({
      count: requestCount,
      requests: Array.from(requests.entries()),
    }));
  }
};

const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('governance_requests');
    if (data) {
      const parsed = JSON.parse(data);
      requestCount = parsed.count;
      requests.clear();
      parsed.requests.forEach(([id, req]: [number, ServiceRequest]) => {
        requests.set(id, req);
      });
    }
  }
};

// Initialize with some demo data
export const initDemoData = () => {
  loadFromStorage();
  if (requests.size === 0) {
    const demoRequests: Omit<ServiceRequest, 'id' | 'txHash'>[] = [
      {
        citizen: '0x1234567890abcdef1234567890abcdef12345678',
        service: 'Birth Certificate',
        description: 'Need certified copy of birth certificate for passport application',
        timestamp: Date.now() - 86400000 * 3,
        status: 'Completed',
      },
      {
        citizen: '0xabcdef1234567890abcdef1234567890abcdef12',
        service: 'Property Registration',
        description: 'Register newly purchased property in my name',
        timestamp: Date.now() - 86400000 * 2,
        status: 'InProgress',
      },
      {
        citizen: '0x7890abcdef1234567890abcdef1234567890abcd',
        service: 'Complaint',
        description: 'Street light not working in sector 15 for past 2 weeks',
        timestamp: Date.now() - 86400000,
        status: 'Pending',
      },
    ];
    
    demoRequests.forEach(req => {
      requestCount++;
      requests.set(requestCount, {
        ...req,
        id: requestCount,
        txHash: generateTxHash(),
      });
    });
    saveToStorage();
  }
};

// Get statistics
export const getStatistics = async () => {
  loadFromStorage();
  const allRequests = Array.from(requests.values());
  
  return {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'Pending').length,
    inProgress: allRequests.filter(r => r.status === 'InProgress').length,
    completed: allRequests.filter(r => r.status === 'Completed').length,
  };
};
