import React, { useState, useEffect } from 'react';

const APIStatusChecker: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'fallback' | 'error'>('checking');
  const [showDetails, setShowDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

    // Check if API key exists
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === '') {
      setApiStatus('fallback');
      setErrorMessage('API key chưa được cấu hình');
      return;
    }

    // Try to make a test API call
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'test',
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        setApiStatus('active');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setApiStatus('error');
        
        if (response.status === 401) {
          setErrorMessage('API key không hợp lệ');
        } else if (response.status === 429) {
          setErrorMessage('API đã hết quota');
        } else {
          setErrorMessage(`Lỗi: ${response.status}`);
        }
      }
    } catch (error) {
      setApiStatus('fallback');
      setErrorMessage('Không thể kết nối API');
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
      case 'error':
        return '❌';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'checking':
        return 'Đang kiểm tra...';
      case 'active':
        return 'AI đang hoạt động';
      case 'fallback':
        return 'Chế độ Offline';
      case 'error':
        return 'API lỗi';
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
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor()}`}
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
              {errorMessage && (
                <p className="text-xs mt-1 opacity-80">{errorMessage}</p>
              )}
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              {apiStatus === 'active' && (
                <div>
                  <p className="font-semibold text-green-700 mb-1">🎉 Hoàn hảo!</p>
                  <p className="text-gray-600">AI đang hoạt động tốt. Mỗi lần chơi HSK sẽ có từ vựng mới!</p>
                </div>
              )}
              
              {apiStatus === 'fallback' && (
                <div>
                  <p className="font-semibold text-yellow-700 mb-1">📚 Chế độ Offline</p>
                  <p className="text-gray-600 mb-2">App đang dùng từ vựng có sẵn (không cần API key).</p>
                  <p className="text-xs text-gray-500">
                    💡 Muốn dùng AI? Thêm GEMINI_API_KEY vào Vercel Environment Variables.
                  </p>
                </div>
              )}
              
              {apiStatus === 'error' && (
                <div>
                  <p className="font-semibold text-red-700 mb-1">⚠️ API gặp vấn đề</p>
                  <p className="text-gray-600 mb-2">{errorMessage}. App tự động chuyển sang dùng từ có sẵn.</p>
                  <p className="text-xs text-gray-500">
                    💡 Kiểm tra API key trong Vercel Settings.
                  </p>
                </div>
              )}
              
              {apiStatus === 'checking' && (
                <div>
                  <p className="text-gray-600">Đang kiểm tra kết nối API...</p>
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
              {(apiStatus === 'fallback' || apiStatus === 'error') && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-panda-accent text-panda-dark rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold text-center"
                >
                  🔑 Lấy API Key
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
