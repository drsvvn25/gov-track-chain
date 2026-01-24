import { ServiceRequest } from '@/lib/blockchain';
import { ExternalLink, Blocks, Fuel, Hash, Clock } from 'lucide-react';

interface BlockchainExplorerProps {
  request: ServiceRequest;
}

const BlockchainExplorer = ({ request }: BlockchainExplorerProps) => {
  // Simulated blockchain data (in real app, fetch from ethers.js)
  const blockNumber = 18000000 + request.id * 1234;
  const gasUsed = 21000 + Math.floor(Math.random() * 50000);
  const confirmations = Math.floor((Date.now() - request.timestamp) / 60000) + 1;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Blocks className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold">Blockchain Details</h3>
      </div>

      <div className="space-y-4">
        {/* Transaction Hash */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Hash className="w-3 h-3" />
            Transaction Hash
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm break-all">{request.txHash}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${request.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Block Info Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Blocks className="w-3 h-3" />
              Block
            </div>
            <p className="font-mono text-sm font-medium">{blockNumber.toLocaleString()}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Fuel className="w-3 h-3" />
              Gas Used
            </div>
            <p className="font-mono text-sm font-medium">{gasUsed.toLocaleString()}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              Confirmations
            </div>
            <p className="font-mono text-sm font-medium text-success">{confirmations}</p>
          </div>
        </div>

        {/* Network Info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Sepolia Testnet</span>
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${request.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View on Etherscan
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Digital Signature */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="text-xs text-muted-foreground mb-2">Digital Signature</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-success text-xs">✓</span>
            </div>
            <div>
              <p className="text-sm font-medium">Signed by</p>
              <p className="font-mono text-xs text-muted-foreground">
                {request.citizen.slice(0, 10)}...{request.citizen.slice(-8)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainExplorer;
