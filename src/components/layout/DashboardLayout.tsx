import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AIAssistant } from '@/components/crm/AIAssistant';

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'Leads', icon: Sparkles, route: '/leads' },
  { label: 'Deals', icon: Briefcase, route: '/deals' },
  { label: 'Contacts', icon: Users, route: '/contacts' },
  { label: 'Tasks', icon: CheckSquare, route: '/tasks' },
  { label: 'Messages', icon: MessageSquare, route: '/messages' },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, organization, signOut } = useAuth();
  const { currentRoute, navigate } = useNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const activeNavItem = navItems.find(item => item.route === currentRoute) || navItems[0];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card transition-smooth">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>NeuralFlow</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth",
                currentRoute === item.route 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage src={(user as any)?.avatar || (user as any)?.avatarUrl} />
              <AvatarFallback className="bg-primary/5 text-primary text-xs">
                {user?.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{organization?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold lg:text-xl">{activeNavItem.label}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Assistant
            </Button>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
            <Button size="sm" className="shadow-elegant">New Task</Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card border-r shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <Sparkles className="w-6 h-6" />
                <span>NeuralFlow</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-smooth",
                    currentRoute === item.route 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-6 border-t mt-auto">
              <Button 
                variant="destructive" 
                className="w-full justify-start gap-3 rounded-xl py-6"
                onClick={signOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* AI Assistant Chat */}
      <AIAssistant />
    </div>
  );
};
