import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { createRequest } from '@/lib/blockchain';
import { FileText, Send, Loader2, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const serviceTypes = [
  'Birth Certificate',
  'Death Certificate',
  'Property Registration',
  'Complaint',
  'License Application',
  'Tax Query',
  'Infrastructure Issue',
  'Other',
];

const Submit = () => {
  const { address, connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();
  
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: number; txHash: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!serviceType || !description.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const request = await createRequest(address, serviceType, description);
      setSubmitted({ id: request.id, txHash: request.txHash });
      toast.success('Request submitted to blockchain!');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="glass-card p-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-8">
                You need to connect your wallet to submit a service request on the blockchain.
              </p>
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                variant="glow"
                size="lg"
              >
                <Wallet className="w-5 h-5" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="glass-card p-12 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Request Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your request has been stored on the blockchain and cannot be tampered with.
              </p>
              
              <div className="glass-card p-4 mb-6 text-left">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase">Request ID</span>
                    <p className="font-display font-bold text-xl text-primary">#{submitted.id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase">Transaction Hash</span>
                    <p className="font-mono text-sm break-all text-muted-foreground">{submitted.txHash}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate(`/track?id=${submitted.id}`)}
                  variant="glow"
                  size="lg"
                >
                  Track This Request
                </Button>
                <Button 
                  onClick={() => {
                    setSubmitted(null);
                    setServiceType('');
                    setDescription('');
                  }}
                  variant="outline"
                  size="lg"
                >
                  Submit Another Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Submit Service Request</h1>
            <p className="text-muted-foreground">
              Your request will be permanently stored on the blockchain
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8">
            {/* Connected Wallet */}
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">Connected Wallet</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/30 border border-border">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="font-mono text-sm">{address}</span>
              </div>
            </div>

            {/* Service Type */}
            <div className="mb-6">
              <label className="block text-sm text-muted-foreground mb-2">Service Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {serviceTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setServiceType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      serviceType === type
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/30 border-border hover:border-primary/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm text-muted-foreground mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your service request in detail..."
                className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-32"
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                This information will be permanently stored on the blockchain
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !serviceType || !description.trim()}
              variant="glow"
              size="xl"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting to Blockchain...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit;
