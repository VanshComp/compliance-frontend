
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserRole = 'designer' | 'compliance' | 'brand-manager';

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('designer');
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    const name = userName || getDefaultName(selectedRole);
    onLogin(selectedRole, name);
  };

  const getDefaultName = (role: UserRole) => {
    switch (role) {
      case 'designer': return 'Priya Sharma';
      case 'compliance': return 'Rajesh Kumar';
      case 'brand-manager': return 'Anita Desai';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'designer': return 'Upload and verify brand assets for compliance';
      case 'compliance': return 'Monitor brand consistency across subsidiaries';
      case 'brand-manager': return 'Manage brand guidelines and team oversight';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Simple background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-32 w-16 h-16 border border-primary/20 rounded-full"></div>
        <div className="absolute bottom-40 right-40 w-12 h-12 border border-primary/15 rounded-full"></div>
        <div className="absolute top-1/2 left-16 w-8 h-8 bg-primary/5 rounded-full"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10 p-4">
        {/* Corporate Logo and Header */}
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto corporate-card-elevated rounded-xl flex items-center justify-center corporate-hover">
            <img 
              src="/lovable-uploads/f1965c8a-ba23-43da-80d2-e1828995c058.png" 
              alt="Project Centura Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-heading font-bold text-foreground">Project Centura</h1>
            <h2 className="text-xl font-body font-medium text-muted-foreground">Brand Compliance Platform</h2>
            <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed font-body">
              Advanced AI-powered compliance verification & management system
            </p>
            <div className="pt-3 space-y-1">
              <p className="text-sm text-muted-foreground font-body">by <span className="font-medium text-primary">PodcastCircle</span></p>
              <p className="text-sm text-muted-foreground/80 font-body">Made for JSW Group</p>
            </div>
          </div>
        </div>

        {/* Corporate Login Card */}
        <div className="corporate-card-elevated rounded-lg p-8 corporate-hover">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-2xl font-heading font-semibold text-foreground">Welcome Back</h3>
            <p className="text-base font-body text-muted-foreground">
              Choose your role to access the platform
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-body font-medium">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="corporate-card border-border focus:border-primary font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground font-body font-medium">Select Your Role</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger className="corporate-card border-border focus:border-primary font-body">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="corporate-card">
                  <SelectItem value="designer">
                    <div className="flex flex-col items-start">
                      <span className="font-body font-medium">Design Team Member</span>
                      <span className="text-xs text-muted-foreground font-body">Upload & verify assets</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="compliance">
                    <div className="flex flex-col items-start">
                      <span className="font-body font-medium">Compliance Officer</span>
                      <span className="text-xs text-muted-foreground font-body">Monitor brand consistency</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="brand-manager">
                    <div className="flex flex-col items-start">
                      <span className="font-body font-medium">Brand Manager</span>
                      <span className="text-xs text-muted-foreground font-body">Manage guidelines & oversight</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="corporate-card border-border rounded-lg p-4">
              <p className="text-sm text-foreground font-body">
                <strong className="font-medium">As a {selectedRole.replace('-', ' ')}:</strong><br />
                <span className="text-muted-foreground">{getRoleDescription(selectedRole)}</span>
              </p>
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full corporate-button-primary font-body font-medium text-base h-12 rounded-lg"
            >
              Enter Centura Platform
            </Button>
          </div>
        </div>

        {/* Corporate System Status */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-body text-muted-foreground">All compliance systems operational</span>
          </div>
          <p className="text-sm font-body text-muted-foreground/80">
            Centura v3.0 • Multi-layer verification active
          </p>
          <div className="text-sm font-body text-muted-foreground/60 pt-3 border-t border-border">
            Built by PodcastCircle
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
