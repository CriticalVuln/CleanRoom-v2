import React, { useState, useRef } from 'react';
import { Settings, Download, Upload, RefreshCw, Trash2, X } from 'lucide-react';

interface SettingsPanelProps {
  onClearData: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClearData,
  onExportData,
  onImportData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportData(file);
      event.target.value = ''; // Reset input
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 z-50"
        aria-label="Open settings"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Data Management
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onExportData();
                  setIsOpen(false);
                }}
                className="w-full btn-secondary flex items-center gap-2 justify-center"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
              
              <button
                onClick={handleImportClick}
                className="w-full btn-secondary flex items-center gap-2 justify-center"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <button
                onClick={() => {
                  onClearData();
                  setIsOpen(false);
                }}
                className="w-full bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export your data to create backups, or import previously exported data. 
              Sample data can help you explore all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
