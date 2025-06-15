
import { Player } from "@/components/dashboard/Interfaces"

interface PlayerCardProps {
    player: Player;
    isActive: boolean;
    onClick: (player: Player) => void;
}
  
const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, onClick }) => (
    <button
      onClick={() => onClick(player)}
      className={`p-3 lg:min-h-10 lg:min-w-60 lg:max-h-10 lg:max-w-60 rounded-lg border transition-all hover:bg-green-600/20 z-20 ${
        isActive 
          ? 'bg-green-600/30 border-green-500 text-green-400' 
          : 'bg-[#0B1901]/50 border-green-800 text-white hover:bg-[#0B1901]/70'
      }`}
    >
      <div className="inline-block text-sm font-medium z-20">{player.name} • </div>
      <div className="inline-block text-xs opacity-75 z-20"> &nbsp;{player.team} • {player.position}</div>
    </button>
);


  export default PlayerCard;