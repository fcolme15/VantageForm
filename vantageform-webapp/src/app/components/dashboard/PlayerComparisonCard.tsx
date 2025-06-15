import { Player } from "@/components/dashboard/Interfaces";
import { Plus } from 'lucide-react';

interface ComparisonPlayerCardProps {
    player: Player | null;
    title: string;
    onClick: () => void;
}
  
const ComparisonPlayerCard: React.FC<ComparisonPlayerCardProps> = ({ player, title, onClick }) => (
<div className="bg-[#0B1901]/50 rounded-lg p-4 border border-green-800">
    <h4 className="text-sm font-medium text-gray-300 mb-3">{title}</h4>
    {player ? (
    <div className="space-y-3">
        <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
            {player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
            <div className="font-medium text-white">{player.name}</div>
            <div className="text-xs text-gray-300">{player.team} • {player.position}</div>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#0B1901]/70 rounded p-2 text-center">
            <div className="text-green-400 font-bold">8.7</div>
            <div className="text-gray-400">Proj</div>
        </div>
        <div className="bg-[#0B1901]/70 rounded p-2 text-center">
            <div className="text-blue-400 font-bold">7.2</div>
            <div className="text-gray-400">Avg</div>
        </div>
        </div>
        <button
        onClick={onClick}
        className="w-full text-xs text-green-400 hover:text-green-300 transition-colors"
        >
        Change Player
        </button>
    </div>
    ) : (
    <button
        onClick={onClick}
        className="w-full h-24 border border-dashed border-green-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-600 transition-all"
    >
        <Plus className="w-6 h-6" />
    </button>
    )}
</div>
);


export default ComparisonPlayerCard;