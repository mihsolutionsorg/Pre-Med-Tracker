import { Home, Map, BarChart3, Target, User } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: Map },
    { id: 'track', label: 'Track', icon: BarChart3 },
    { id: 'focus', label: 'Focus', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-3 py-3">
        <div className="flex justify-between gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg transition-all flex-1 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1.5 font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
