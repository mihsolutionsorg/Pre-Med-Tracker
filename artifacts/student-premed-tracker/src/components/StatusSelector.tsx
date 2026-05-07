import { GraduationCap, BookOpen, Stethoscope, Clock } from 'lucide-react';

interface StatusSelectorProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { id: 'undergrad-freshman', label: 'Undergrad - Freshman', icon: GraduationCap, color: 'bg-green-500' },
  { id: 'undergrad-sophomore', label: 'Undergrad - Sophomore', icon: GraduationCap, color: 'bg-green-600' },
  { id: 'undergrad-junior', label: 'Undergrad - Junior', icon: GraduationCap, color: 'bg-teal-500' },
  { id: 'undergrad-senior', label: 'Undergrad - Senior', icon: GraduationCap, color: 'bg-teal-600' },
  { id: 'gap-year', label: 'Gap Year / Post-Bacc', icon: Clock, color: 'bg-purple-500' },
];

export function StatusSelector({ selectedStatus, onStatusChange }: StatusSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-700 mb-4">Where are you on your journey?</h2>
      <div className="grid grid-cols-1 gap-3">
        {statusOptions.map((status) => {
          const Icon = status.icon;
          const isSelected = selectedStatus === status.id;

          return (
            <button
              key={status.id}
              onClick={() => onStatusChange(status.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`${status.color} p-2 rounded-lg text-white`}>
                <Icon size={20} />
              </div>
              <span className={`${isSelected ? 'font-semibold text-blue-700' : 'text-gray-700'}`}>
                {status.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
