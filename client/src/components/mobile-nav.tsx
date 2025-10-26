import { Link, useLocation } from 'wouter';
import type { UserRole } from '@shared/schema';

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

interface MobileNavProps {
  userRole: UserRole;
}

export function MobileNav({ userRole }: MobileNavProps) {
  const [location] = useLocation();
  const roleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border md:hidden z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      data-testid="mobile-nav"
    >
      <div className="flex justify-around items-center h-16">
        {roleNavItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <a className="flex flex-col items-center justify-center min-w-[64px] px-2 py-1 hover-elevate active-elevate-2 rounded-md">
                <span 
                  className={`material-icons text-2xl transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.icon}
                </span>
                <span 
                  className={`text-xs mt-0.5 font-medium transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
