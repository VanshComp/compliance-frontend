
import { useState } from 'react';
import LoginScreen from '../components/LoginScreen';
import DesignerDashboard from '../components/DesignerDashboard';
import ComplianceOfficerDashboard from '../components/ComplianceOfficerDashboard';
import UploadAnalysisFlow from '../components/UploadAnalysisFlow';
import ComplianceUploadCenter from '../components/ComplianceUploadCenter';

type UserRole = 'designer' | 'compliance' | 'brand-manager' | null;
type AppView = 'login' | 'dashboard' | 'upload-flow' | 'compliance-center';

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [userName, setUserName] = useState('');

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setCurrentView('dashboard');
  };

  const handleStartUpload = () => {
    setCurrentView('compliance-center');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    if (currentView === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (currentView === 'upload-flow') {
      return (
        <UploadAnalysisFlow 
          onBack={handleBackToDashboard}
          userRole={userRole}
          userName={userName}
        />
      );
    }

    if (currentView === 'compliance-center') {
      return (
        <ComplianceUploadCenter 
          onBack={handleBackToDashboard}
          userName={userName}
        />
      );
    }

    // Dashboard view
    if (userRole === 'designer') {
      return (
        <DesignerDashboard 
          userName={userName}
          onStartUpload={handleStartUpload}
          onLogout={handleLogout}
        />
      );
    }

    if (userRole === 'compliance' || userRole === 'brand-manager') {
      return (
        <ComplianceOfficerDashboard 
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
        />
      );
    }

    return <LoginScreen onLogin={handleLogin} />;
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
