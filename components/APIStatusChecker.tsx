import React, { useState, useEffect } from 'react';

const APIStatusChecker: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'fallback'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = () => {
    const apiKey = import.meta.env.API_KEY;

    // Simply check if API key exists
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === '' || apiKey === 'undefined') {
      setApiStatus('fallback');
    } else {
      setApiStatus('active');
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'checking':
        return '🔄';
      case 'active':
        return '✅';
      case 'fallback':
        return '⚠️';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'checking':
        return 'Đang kiểm tra...';
      case 'active':
        return 'AI Active';
      case 'fallback':
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'checking':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'fallback':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor()}`}
        title="Kiểm tra trạng thái API"
      >
        <span className="text-lg">{getStatusIcon()}</span>
        <span className="text-sm font-semibold hidden sm:inline">{getStatusText()}</span>
      </button>

      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-gray-200 p-4 z-50 animate-pop">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-800">Trạng thái API</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Status */}
            <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getStatusIcon()}</span>
                <span className="font-bold">{getStatusText()}</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              {apiStatus === 'active' && (
                <div>
                  <p className="font-semibold text-green-700 mb-1">🎉 API Key đã cấu hình!</p>
                  <p className="text-gray-600">Gemini AI sẽ tạo từ vựng mới mỗi lần chơi HSK.</p>
                  <p className="text-xs text-gray-500 mt-2">
                    API Key: {import.meta.env.API_KEY?.substring(0, 20)}...
                  </p>
                </div>
              )}
              
              {apiStatus === 'fallback' && (
                <div>
                  <p className="font-semibold text-yellow-700 mb-1">📚 Chế độ Offline</p>
                  <p className="text-gray-600 mb-2">App đang dùng từ vựng có sẵn (không cần API key).</p>
                  <p className="text-xs text-gray-500">
                    💡 Muốn dùng AI? Thêm <code className="bg-yellow-100 px-1 rounded">API_KEY</code> vào Vercel.
                  </p>
                </div>
              )}
              
              {apiStatus === 'checking' && (
                <div>
                  <p className="text-gray-600">Đang kiểm tra cấu hình...</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={checkAPIStatus}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
              >
                🔄 Kiểm tra lại
              </button>
              {apiStatus === 'fallback' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-panda-accent text-panda-dark rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold text-center"
                >
                  🔑 Lấy Key
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIStatusChecker;
