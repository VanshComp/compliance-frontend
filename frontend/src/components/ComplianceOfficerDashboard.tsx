
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Eye, Filter, BarChart3 } from 'lucide-react';

interface ComplianceOfficerDashboardProps {
  userName: string;
  userRole: string | null;
  onLogout: () => void;
}

const ComplianceOfficerDashboard = ({ userName, userRole, onLogout }: ComplianceOfficerDashboardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');

  const overallMetrics = {
    totalScore: 89,
    activeViolations: 12,
    pendingReviews: 8,
    monthlyTrend: +5.2
  };

  const subsidiaries = [
    {
      name: 'JSW Steel',
      score: 94,
      trend: +2.1,
      violations: 2,
      assets: 145,
      status: 'excellent'
    },
    {
      name: 'JSW Infrastructure',
      score: 87,
      trend: +1.8,
      violations: 4,
      assets: 89,
      status: 'good'
    },
    {
      name: 'JSW Energy',
      score: 91,
      trend: -0.5,
      violations: 3,
      assets: 76,
      status: 'good'
    },
    {
      name: 'JSW Cement',
      score: 83,
      trend: +3.2,
      violations: 6,
      assets: 112,
      status: 'needs-attention'
    },
    {
      name: 'JSW Paints',
      score: 78,
      trend: -1.2,
      violations: 8,
      assets: 67,
      status: 'needs-attention'
    },
    {
      name: 'JSW MG Motor',
      score: 92,
      trend: +4.1,
      violations: 1,
      assets: 134,
      status: 'excellent'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'violation',
      message: 'Logo placement violation detected',
      subsidiary: 'JSW Paints',
      timestamp: '5 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'approval',
      message: 'Social media asset approved',
      subsidiary: 'JSW Steel',
      timestamp: '12 minutes ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'review',
      message: 'Asset pending compliance review',
      subsidiary: 'JSW Infrastructure',
      timestamp: '25 minutes ago',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'violation',
      message: 'Font guideline violation',
      subsidiary: 'JSW Cement',
      timestamp: '1 hour ago',
      severity: 'high'
    }
  ];

  const violationReports = [
    {
      id: 1,
      asset: 'Q4 Campaign Banner',
      subsidiary: 'JSW Paints',
      violationType: 'Logo Size',
      severity: 'High',
      daysOpen: 3,
      assignee: 'Priya Sharma',
      status: 'in-progress'
    },
    {
      id: 2,
      asset: 'Product Brochure',
      subsidiary: 'JSW Cement',
      violationType: 'Font Usage',
      severity: 'Medium',
      daysOpen: 1,
      assignee: 'Raj Patel',
      status: 'new'
    },
    {
      id: 3,
      asset: 'Website Header',
      subsidiary: 'JSW Energy',
      violationType: 'Color Palette',
      severity: 'Low',
      daysOpen: 7,
      assignee: 'Anita Desai',
      status: 'under-review'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-attention': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'violation': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'approval': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'review': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Corporate Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <p className="text-sm font-body text-muted-foreground">
                  {userRole === 'compliance' ? 'Compliance Officer Dashboard' : 'Brand Manager Dashboard'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
        {/* Corporate Controls */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Compliance Overview</h2>
            <p className="text-base font-body text-muted-foreground">Monitor brand consistency across all JSW Build subsidiaries</p>
          </div>
          
          <div className="flex space-x-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32 font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="corporate-button-secondary font-body">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Corporate Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="corporate-card-elevated rounded-lg p-6 corporate-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-muted-foreground">Overall Compliance</p>
                <p className="text-3xl font-heading font-bold text-green-600">{overallMetrics.totalScore}%</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-body">+{overallMetrics.monthlyTrend}%</span>
              </div>
            </div>
          </div>

          <div className="corporate-card-elevated rounded-lg p-6 corporate-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-muted-foreground">Active Violations</p>
                <p className="text-3xl font-heading font-bold text-red-600">{overallMetrics.activeViolations}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="corporate-card-elevated rounded-lg p-6 corporate-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-3xl font-heading font-bold text-amber-600">{overallMetrics.pendingReviews}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="corporate-card-elevated rounded-lg p-6 corporate-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-muted-foreground">Monthly Assets</p>
                <p className="text-3xl font-heading font-bold text-primary">247</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Corporate Main Content */}
        <Tabs defaultValue="subsidiaries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subsidiaries" className="font-body">Subsidiary Overview</TabsTrigger>
            <TabsTrigger value="violations" className="font-body">Violation Management</TabsTrigger>
            <TabsTrigger value="activity" className="font-body">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="subsidiaries" className="space-y-6">
            <div className="corporate-card-elevated rounded-lg">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-heading font-semibold text-foreground">Subsidiary Performance</h3>
                <p className="text-base font-body text-muted-foreground">
                  Compliance scores and trends across all JSW Build companies
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subsidiaries.map((subsidiary, index) => (
                    <div key={index} className="corporate-card rounded-lg p-6 corporate-hover">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-body font-semibold text-foreground">{subsidiary.name}</h4>
                          <Badge className={`text-xs font-body ${getStatusColor(subsidiary.status)}`}>
                            {subsidiary.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-body text-muted-foreground">Compliance Score</span>
                            <span className="text-lg font-heading font-bold text-foreground">{subsidiary.score}%</span>
                          </div>
                          <Progress value={subsidiary.score} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground font-body">Violations</span>
                            <p className="font-heading font-semibold text-red-600">{subsidiary.violations}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-body">Assets</span>
                            <p className="font-heading font-semibold text-primary">{subsidiary.assets}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {subsidiary.trend >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-body ${subsidiary.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {subsidiary.trend >= 0 ? '+' : ''}{subsidiary.trend}%
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="corporate-hover font-body">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <div className="corporate-card-elevated rounded-lg">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-heading font-semibold text-foreground">Active Violations</h3>
                <p className="text-base font-body text-muted-foreground">
                  Compliance issues requiring attention across subsidiaries
                </p>
              </div>
              <div className="p-6 space-y-4">
                {violationReports.map((violation) => (
                  <div key={violation.id} className="p-4 corporate-card rounded-lg corporate-hover">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <h4 className="font-body font-medium text-foreground">{violation.asset}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs font-body">{violation.subsidiary}</Badge>
                            <Badge className={`text-xs font-body ${getSeverityColor(violation.severity.toLowerCase())}`}>
                              {violation.severity}
                            </Badge>
                            <span className="text-xs font-body text-muted-foreground">{violation.daysOpen} days open</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm">
                          <p className="font-body font-medium text-foreground">{violation.violationType}</p>
                          <p className="font-body text-muted-foreground">Assigned: {violation.assignee}</p>
                        </div>
                        <Button variant="outline" size="sm" className="corporate-hover font-body">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="corporate-card-elevated rounded-lg">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-heading font-semibold text-foreground">Recent Activity</h3>
                <p className="text-base font-body text-muted-foreground">
                  Real-time feed of compliance activities across all subsidiaries
                </p>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 corporate-card rounded-lg corporate-hover">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="font-body font-medium text-foreground">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs font-body">{activity.subsidiary}</Badge>
                        <span className="text-xs font-body text-muted-foreground">{activity.timestamp}</span>
                      </div>
                    </div>
                    <Badge className={`text-xs font-body ${getSeverityColor(activity.severity)}`}>
                      {activity.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceOfficerDashboard;
