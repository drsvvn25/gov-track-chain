import { useWallet } from '@/context/WalletContext';
import { User, Shield } from 'lucide-react';

const RoleSelector = () => {
  const { isAdmin, setIsAdmin, address } = useWallet();

  if (!address) return null;

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/30 border border-border">
      <button
        onClick={() => setIsAdmin(false)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          !isAdmin 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Citizen
      </button>
      <button
        onClick={() => setIsAdmin(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          isAdmin 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        Officer
      </button>
    </div>
  );
};

export default RoleSelector;
