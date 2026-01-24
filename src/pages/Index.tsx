import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Eye, Zap, Database, Wallet, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const { address, connectWallet, isConnecting } = useWallet();

  const features = [
    {
      icon: Lock,
      title: 'Immutable Records',
      description: 'Every request is permanently stored on the blockchain. Cannot be edited or deleted.',
    },
    {
      icon: Eye,
      title: 'Full Transparency',
      description: 'Track your request status in real-time. Every update is publicly verifiable.',
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Get notified when your request status changes. No more waiting in dark.',
    },
    {
      icon: Database,
      title: 'Decentralized',
      description: 'No single point of failure. Your data is secured across the network.',
    },
  ];

  const steps = [
    { step: 1, title: 'Connect Wallet', description: 'Link your MetaMask wallet' },
    { step: 2, title: 'Submit Request', description: 'File your service request' },
    { step: 3, title: 'Track Status', description: 'Monitor progress on-chain' },
    { step: 4, title: 'Get Resolved', description: 'Receive verified completion' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 blockchain-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Powered by Blockchain</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Transparent{' '}
              <span className="gradient-text">Governance</span>
              <br />
              for Citizens
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Every government service request tracked on blockchain. 
              No corruption. No delays. Complete transparency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              {address ? (
                <Link to="/submit">
                  <Button size="xl" variant="glow">
                    Submit Request
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="xl" 
                  variant="glow"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <Wallet className="w-5 h-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet to Start'}
                </Button>
              )}
              <Link to="/dashboard">
                <Button size="xl" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-3xl font-display font-bold glow-text">100%</p>
                <p className="text-sm text-muted-foreground">Transparent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold glow-text">0</p>
                <p className="text-sm text-muted-foreground">Data Tampering</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold glow-text">24/7</p>
                <p className="text-sm text-muted-foreground">Tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-xl bg-primary/10 border border-primary/20 animate-float flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 rounded-xl bg-success/10 border border-success/20 animate-float flex items-center justify-center" style={{ animationDelay: '2s' }}>
          <CheckCircle2 className="w-6 h-6 text-success" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why <span className="gradient-text">GovChain</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on blockchain technology to ensure every government interaction 
              is transparent, traceable, and tamper-proof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Simple 4-step process to file and track your government requests
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-4">
                Ready to Experience Transparent Governance?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of citizens who trust blockchain for their government services.
              </p>
              {address ? (
                <Link to="/submit">
                  <Button size="xl" variant="glow">
                    Submit Your First Request
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="xl" 
                  variant="glow"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <Wallet className="w-5 h-5" />
                  Get Started Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>GovChain — Transparent Governance on Blockchain</p>
          <p className="mt-2">Built for a corruption-free future 🌐</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
