import React, { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scrollAmount: number;
  onScrollAmountChange: (amount: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  scrollAmount,
  onScrollAmountChange,
}) => {
  const [localAmount, setLocalAmount] = useState(scrollAmount);

  const handleChange = (value: number) => {
    setLocalAmount(value);
    onScrollAmountChange(value);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-qidian-panel shadow-xl z-[70] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-qidian-text">阅读设置</h2>
            <button
              onClick={onClose}
              className="text-qidian-gray hover:text-qidian-red text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            {/* Scroll Amount */}
            <div>
              <label className="block text-qidian-text font-medium mb-2">
                滚动幅度
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={localAmount}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-qidian-border rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #bf2c24 0%, #bf2c24 ${((localAmount - 50) / 450) * 100}%, #e6e0d0 ${((localAmount - 50) / 450) * 100}%, #e6e0d0 100%)`
                  }}
                />
                <span className="text-qidian-text font-mono w-16 text-right">
                  {localAmount}px
                </span>
              </div>
              <p className="text-xs text-qidian-gray mt-2">
                每次按键滚动的像素距离
              </p>
            </div>

            {/* Preset buttons */}
            <div>
              <label className="block text-qidian-text font-medium mb-2">
                快速选择
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '小', value: 100 },
                  { label: '中', value: 200 },
                  { label: '大', value: 300 },
                  { label: '半屏', value: 400 },
                  { label: '全屏', value: 500 },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleChange(value)}
                    className={`px-3 py-2 rounded border transition-colors ${
                      localAmount === value
                        ? 'bg-qidian-red text-white border-qidian-red'
                        : 'bg-white text-qidian-text border-qidian-border hover:border-qidian-red'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-qidian-hover/50 p-4 rounded-lg border border-qidian-border">
              <p className="text-sm text-qidian-gray">
                <strong className="text-qidian-text">提示：</strong>
                使用 <kbd className="px-2 py-0.5 bg-white rounded text-xs border border-qidian-border">W/S</kbd>{' '}
                或 <kbd className="px-2 py-0.5 bg-white rounded text-xs border border-qidian-border">↑/↓</kbd>{' '}
                键滚动页面，调整合适的滚动幅度以获得最佳阅读体验。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
