import { Link, useLocation } from 'wouter';
import type { UserRole } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin'] },
  { path: '/admin/farmers', label: 'Farmers', icon: 'people', roles: ['admin'] },
  { path: '/admin/orders', label: 'Orders', icon: 'receipt_long', roles: ['admin'] },
  
  { path: '/agent/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['agent'] },
  { path: '/agent/new-order', label: 'New Order', icon: 'add_circle', roles: ['agent'] },
  { path: '/agent/farmers', label: 'My Farmers', icon: 'people', roles: ['agent'] },
  { path: '/agent/profile', label: 'Profile', icon: 'account_circle', roles: ['agent'] },
  
  { path: '/farmer/orders', label: 'My Orders', icon: 'receipt_long', roles: ['farmer'] },
  { path: '/farmer/payments', label: 'Payments', icon: 'payments', roles: ['farmer'] },
  { path: '/farmer/profile', label: 'Profile', icon: 'account_circle', roles: ['farmer'] },
];

interface DesktopNavProps {
  userRole: UserRole;
  userName?: string;
  onLogout?: () => void;
}

export function DesktopNav({ userRole, userName, onLogout }: DesktopNavProps) {
  const [location] = useLocation();
  const roleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <nav 
      className="hidden md:flex sticky top-0 z-50 h-16 bg-card border-b border-card-border items-center justify-between px-6"
      data-testid="desktop-nav"
    >
      <div className="flex items-center gap-2">
        <span className="material-icons text-primary text-3xl">agriculture</span>
        <h1 className="text-xl font-bold text-foreground">Gladfore</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {roleNavItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"}
                  className="gap-2"
                >
                  <span className="material-icons text-xl">{item.icon}</span>
                  {item.label}
                </Button>
              </a>
            </Link>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4">
        {userName && (
          <div className="flex items-center gap-2">
            <span className="material-icons text-2xl text-muted-foreground">account_circle</span>
            <span className="text-sm font-medium text-foreground">{userName}</span>
          </div>
        )}
        {onLogout && (
          <Button 
            variant="outline" 
            onClick={onLogout}
            data-testid="button-logout"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
