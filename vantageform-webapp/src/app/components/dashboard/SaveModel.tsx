
import { Users, Star, X } from 'lucide-react';

interface SaveModel {
    isOpen: boolean;
    onClose: () => void;
    onSave: (type: 'projection' | 'lineup') => void;
}
  
const SaveModel: React.FC<SaveModel> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#0B1901] border border-green-800 rounded-xl p-6 max-w-sm w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Save Current Selection</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-800/50 rounded"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-gray-300 mb-6">Where would you like to save this?</p>
          <div className="space-y-3">
            <button
              onClick={() => onSave('projection')}
              className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-600 rounded-lg p-3 text-white transition-all"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Save as Projection</span>
              </div>
            </button>
            <button
              onClick={() => onSave('lineup')}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600 rounded-lg p-3 text-white transition-all"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Add to Lineup</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
};

export default SaveModel;