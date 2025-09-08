
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Bell, Upload, Search, Filter, LogOut, User, TrendingUp, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface DesignerDashboardProps {
  userName: string;
  onStartUpload: () => void;
  onLogout: () => void;
}

const DesignerDashboard = ({ userName, onStartUpload, onLogout }: DesignerDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const recentProjects = [
    {
      id: 1,
      name: 'JSW Steel Q4 Campaign Banner',
      type: 'Social Media',
      status: 'approved',
      score: 98,
      lastModified: '2 hours ago',
      subsidiary: 'JSW Steel'
    },
    {
      id: 2,
      name: 'Infrastructure Brochure Cover',
      type: 'Print Material',
      status: 'needs-review',
      score: 85,
      lastModified: '1 day ago',
      subsidiary: 'JSW Infrastructure'
    },
    {
      id: 3,
      name: 'Energy Division Logo Usage',
      type: 'Logo Application',
      status: 'in-progress',
      score: 72,
      lastModified: '3 days ago',
      subsidiary: 'JSW Energy'
    },
    {
      id: 4,
      name: 'Cement Brand Presentation',
      type: 'Presentation',
      status: 'approved',
      score: 94,
      lastModified: '1 week ago',
      subsidiary: 'JSW Cement'
    }
  ];

  const quickActions = [
    { title: 'Logo Compliance Check', description: 'Quick verification for logo usage', count: '5 min avg' },
    { title: 'Social Media Package', description: 'Instagram, Facebook, LinkedIn formats', count: '8 templates' },
    { title: 'Print Material Review', description: 'Brochures, flyers, business cards', count: '12 formats' },
    { title: 'Presentation Template', description: 'Brand-compliant slide templates', count: '20 layouts' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'needs-review': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'needs-review': return 'bg-amber-100 text-amber-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Corporate Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 corporate-card rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/f1965c8a-ba23-43da-80d2-e1828995c058.png" 
                  alt="Centura" 
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">Centura Compliance Platform</h1>
                <p className="text-sm font-body text-muted-foreground">Designer Workspace</p>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer corporate-hover" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-medium">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm font-body font-medium text-foreground">{userName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground corporate-hover">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="corporate-card-elevated rounded-xl p-8 corporate-hover">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Welcome back, {userName}!</h2>
                  <p className="text-lg font-body text-muted-foreground mb-8 max-w-md leading-relaxed">
                    Ready to verify compliance? Use our advanced multi-layer system for comprehensive analysis.
                  </p>
                  <Button 
                    onClick={() => navigate("/compliance")} 
                    className="corporate-button-primary font-body font-medium h-12 px-8 text-base"
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Start Compliance Check
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-heading font-bold text-primary">92%</div>
                  <div className="text-base font-body text-muted-foreground">Personal Compliance Score</div>
                  <div className="flex items-center mt-3 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-body">+5% this month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects, assets, or subsidiaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-body"
                />
              </div>
              <Button variant="outline" className="corporate-button-secondary font-body">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Recent Projects */}
            <div className="corporate-card-elevated rounded-xl">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-heading font-semibold text-foreground">Recent Projects</h3>
                <p className="text-base font-body text-muted-foreground">Your latest design verifications and submissions</p>
              </div>
              <div className="p-6 space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 corporate-card rounded-lg corporate-hover">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(project.status)}
                      <div>
                        <h4 className="font-body font-semibold text-foreground">{project.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs font-body">{project.type}</Badge>
                          <Badge variant="outline" className="text-xs font-body">{project.subsidiary}</Badge>
                          <span className="text-xs font-body text-muted-foreground">{project.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-heading font-bold ${getScoreColor(project.score)}`}>
                          {project.score}%
                        </div>
                        <Badge className={`text-xs font-body ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="corporate-hover font-body">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Score Widget */}
            <div className="corporate-card-elevated rounded-xl">
              <div className="p-4 border-b border-border">
                <h4 className="font-heading font-semibold text-foreground">Team Compliance</h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-green-600">94%</div>
                  <div className="text-xs font-body text-muted-foreground">JSW Infrastructure Team</div>
                </div>
                <Progress value={94} className="h-2" />
                <div className="flex justify-between text-xs font-body text-muted-foreground">
                  <span>Target: 90%</span>
                  <span className="text-green-600">+2% vs last month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="corporate-card-elevated rounded-xl">
              <div className="p-4 border-b border-border">
                <h4 className="font-heading font-semibold text-foreground">Quick Actions</h4>
              </div>
              <div className="p-3 space-y-3">
                {quickActions.map((action, index) => (
                  <div key={index} className="p-3 corporate-card rounded-lg corporate-hover cursor-pointer">
                    <h4 className="font-body font-medium text-foreground text-sm">{action.title}</h4>
                    <p className="text-xs font-body text-muted-foreground mt-1">{action.description}</p>
                    <div className="text-xs text-primary font-body font-medium mt-2">{action.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Guide */}
            <div className="corporate-card-elevated rounded-xl">
              <div className="p-4 border-b border-border">
                <h4 className="font-heading font-semibold text-foreground">Status Guide</h4>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-body">Approved - Ready to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-body">Needs Review - Minor fixes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-body">In Progress - Under review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
