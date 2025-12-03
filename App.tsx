import React, { useState, useEffect, useRef } from 'react';
import { AppView, User, GameMode, VocabItem, GameConfig, VocabSet } from './types';
import Button from './components/Button';
import Game from './components/Game';
import { generateHSKVocab } from './services/geminiService';
import { parseExcelFile } from './services/excelService';
import { getSavedSets, createVocabSet, updateVocabSet, deleteVocabSet } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State quản lý danh sách
  const [savedSets, setSavedSets] = useState<VocabSet[]>([]);
  const [newSetName, setNewSetName] = useState('');
  const [targetSetIdForImport, setTargetSetIdForImport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load danh sách đã lưu khi khởi chạy
  useEffect(() => {
    const sets = getSavedSets();
    setSavedSets(sets);
  }, []);

  // -- Actions --

  const handleLogin = () => {
    // Mock Login
    setUser({
      name: "Gấu Trúc Nhỏ",
      avatar: "https://picsum.photos/200/200"
    });
    setSavedSets(getSavedSets());
    setView(AppView.DASHBOARD);
  };

  const handleHSKSelection = async (level: number, mode: GameMode) => {
    setIsLoading(true);
    setError(null);
    try {
      const vocab = await generateHSKVocab(level, 8); // Fetch 8 pairs
      setVocabList(vocab);
      setGameConfig({ sourceType: 'HSK', hskLevel: level, mode });
      setView(AppView.GAME);
    } catch (err) {
      setError("Không thể tạo danh sách từ vựng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Tạo danh sách mới
  const handleCreateSet = () => {
    if (!newSetName.trim()) return;
    const updated = createVocabSet(newSetName);
    setSavedSets(updated);
    setNewSetName('');
  };

  // 2. Kích hoạt chọn file cho một danh sách cụ thể
  const triggerFileUpload = (setId: string) => {
    setTargetSetIdForImport(setId);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
      fileInputRef.current.click();
    }
  };

  // 3. Xử lý file excel sau khi chọn
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !targetSetIdForImport) return;

    setIsLoading(true);
    setError(null);
    try {
      const vocab = await parseExcelFile(file);
      
      // Update logic: Gộp vào danh sách hiện tại
      const updatedSets = updateVocabSet(targetSetIdForImport, vocab);
      setSavedSets(updatedSets);

      // Tìm danh sách vừa update để hiển thị thông báo
      const currentSet = updatedSets.find(s => s.id === targetSetIdForImport);
      const msg = `Đã nhập thành công ${vocab.length} từ vào danh sách "${currentSet?.name}".`;
      alert(msg); // Hoặc dùng toast notification đẹp hơn nếu có

    } catch (err: any) {
      setError(typeof err === 'string' ? err : "Lỗi khi đọc file Excel.");
    } finally {
      setIsLoading(false);
      setTargetSetIdForImport(null);
    }
  };

  // 4. Chơi một danh sách đã lưu
  const handlePlaySavedSet = (set: VocabSet) => {
    if (set.items.length < 4) {
      setError(`Danh sách "${set.name}" cần ít nhất 4 từ để bắt đầu chơi. Hãy nhập thêm từ vựng!`);
      return;
    }

    // Lấy mode từ thẻ select bên giao diện
    const modeSelect = document.getElementById('saved-mode') as HTMLSelectElement;
    const mode = (modeSelect?.value as GameMode) || GameMode.HANZI_MEANING;

    // Random lấy tối đa 12 từ để chơi cho đỡ rối mắt
    const selectedVocab = [...set.items].sort(() => 0.5 - Math.random()).slice(0, 12);
    
    setVocabList(selectedVocab);
    setGameConfig({ sourceType: 'UPLOAD', mode, setId: set.id });
    setView(AppView.GAME);
  };

  const handleDeleteSet = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa danh sách này và toàn bộ từ vựng bên trong?")) {
      const updated = deleteVocabSet(id);
      setSavedSets(updated);
    }
  };

  // Chơi lại bài cũ (Reshuffle các thẻ)
  const handleRestart = () => {
    const currentList = [...vocabList].sort(() => 0.5 - Math.random());
    setVocabList([]); 
    setTimeout(() => setVocabList(currentList), 10);
  };

  // Chơi tiếp (Lấy từ mới)
  const handleNextLevel = () => {
    if (!gameConfig) return;

    // Trường hợp 1: HSK - Gọi API lấy từ mới
    if (gameConfig.sourceType === 'HSK' && gameConfig.hskLevel) {
      handleHSKSelection(gameConfig.hskLevel, gameConfig.mode);
    }
    // Trường hợp 2: Custom List - Random lại 12 từ khác từ danh sách gốc
    else if (gameConfig.sourceType === 'UPLOAD' && gameConfig.setId) {
      const currentSet = savedSets.find(s => s.id === gameConfig.setId);
      if (currentSet) {
        handlePlaySavedSet(currentSet);
      }
    }
  };

  // -- Views --

  const renderAuth = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-panda-light">
      <div className="mb-8 animate-bounce-small">
        <div className="text-8xl">🐼</div>
      </div>
      <h1 className="text-4xl font-extrabold text-panda-dark mb-4">PandaVocab</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Học từ vựng tiếng Trung HSK 1-9 với các trò chơi dễ thương!
      </p>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-panda-secondary w-full max-w-sm">
        <button 
          onClick={handleLogin}
          className="flex items-center justify-center w-full px-4 py-3 font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:shadow-md"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-6 h-6 mr-3" />
          Đăng nhập bằng Google
        </button>
        <p className="mt-4 text-xs text-gray-400">
          *Đây là bản demo. Không cần tài khoản thật.
        </p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-panda-primary">
               <img src={user?.avatar} alt="Người dùng" className="w-full h-full object-cover" />
            </div>
            <div>
               <h2 className="font-bold text-xl text-panda-dark">Chào, {user?.name}!</h2>
               <p className="text-sm text-gray-500">Hôm nay bạn muốn học gì?</p>
            </div>
         </div>
         <Button variant="outline" onClick={() => setView(AppView.AUTH)} className="!px-3 !py-1 text-xs">Đăng xuất</Button>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm">
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
         <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="text-6xl animate-bounce mb-4">🐼</div>
            <p className="text-xl font-bold text-panda-dark">Đang xử lý...</p>
         </div>
      )}

      {/* Hidden File Input used for importing into specific sets */}
      <input 
        type="file" 
        accept=".xlsx"
        ref={fileInputRef}
        className="hidden" 
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN: HSK PRACTICE */}
         <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-panda-primary h-full">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-3xl">📚</span>
                   <div>
                     <h3 className="text-2xl font-bold text-panda-dark">Luyện tập HSK</h3>
                     <p className="text-xs text-gray-400">Tạo thẻ ngẫu nhiên bằng AI</p>
                   </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Chế độ chơi</label>
                  <select 
                    id="hsk-mode"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-panda-primary outline-none bg-gray-50"
                  >
                     <option value={GameMode.HANZI_PINYIN}>Hán tự ↔ Pinyin</option>
                     <option value={GameMode.HANZI_MEANING}>Hán tự ↔ Nghĩa</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                     <Button 
                       key={level} 
                       variant="secondary"
                       className="!py-2 text-sm"
                       onClick={() => {
                         const modeSelect = document.getElementById('hsk-mode') as HTMLSelectElement;
                         handleHSKSelection(level, modeSelect.value as GameMode);
                       }}
                     >
                       HSK {level}
                     </Button>
                   ))}
                </div>
             </div>
         </div>

         {/* RIGHT COLUMN: MY VOCAB LISTS */}
         <div className="lg:col-span-7 flex flex-col gap-6">
             <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-panda-accent h-full">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <span className="text-3xl">📂</span>
                      <div>
                        <h3 className="text-2xl font-bold text-panda-dark">Danh sách của tôi</h3>
                        <p className="text-xs text-gray-400">Quản lý và ôn tập bộ từ vựng riêng</p>
                      </div>
                   </div>
                   
                   {/* Game Mode Selector for Saved Lists */}
                    <div className="w-40">
                      <select 
                        id="saved-mode"
                        className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-panda-accent outline-none bg-gray-50"
                        defaultValue={GameMode.HANZI_MEANING}
                      >
                        <option value={GameMode.HANZI_MEANING}>Hán - Nghĩa</option>
                        <option value={GameMode.HANZI_PINYIN}>Hán - Pinyin</option>
                      </select>
                    </div>
                </div>

                {/* Create New List Form */}
                <div className="flex gap-2 mb-6 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                  <input 
                    type="text" 
                    placeholder="Đặt tên danh sách mới (VD: Đồ ăn, HSK1 Bài 5...)"
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-panda-accent/50"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateSet()}
                  />
                  <Button onClick={handleCreateSet} disabled={!newSetName.trim()} className="!py-2 !px-4 whitespace-nowrap">
                    + Tạo
                  </Button>
                </div>

                {/* List of Sets */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {savedSets.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                       <p className="mb-2 text-2xl">📭</p>
                       <p>Chưa có danh sách nào.</p>
                       <p className="text-sm">Hãy tạo danh sách và nhập file Excel vào nhé!</p>
                    </div>
                  ) : (
                    savedSets.map((set) => (
                      <div key={set.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-panda-accent transition-all group relative">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Set Info */}
                            <div className="flex items-start gap-3">
                               <div className="bg-white p-3 rounded-lg text-2xl shadow-sm">
                                 {set.items.length > 0 ? '📝' : '📁'}
                               </div>
                               <div>
                                 <h4 className="font-bold text-gray-800 text-lg leading-tight">{set.name}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${set.items.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                      {set.items.length} từ
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(set.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                 </div>
                               </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                               <button 
                                 onClick={() => triggerFileUpload(set.id)}
                                 className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors text-sm font-semibold"
                                 title="Nhập thêm từ file Excel"
                               >
                                 📥 Thêm Excel
                               </button>
                               
                               <button 
                                 onClick={() => handlePlaySavedSet(set)}
                                 disabled={set.items.length < 4}
                                 className="flex items-center gap-1 px-4 py-2 bg-panda-primary text-white rounded-lg hover:bg-pink-400 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-transform active:scale-95"
                                 title={set.items.length < 4 ? "Cần ít nhất 4 từ để chơi" : "Bắt đầu chơi"}
                               >
                                 ▶ Chơi
                               </button>

                               <button 
                                 onClick={() => handleDeleteSet(set.id)}
                                 className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                                 title="Xóa danh sách"
                               >
                                 🗑
                               </button>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>

             </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-800 bg-panda-light min-h-screen">
      {view === AppView.AUTH && renderAuth()}
      {view === AppView.DASHBOARD && renderDashboard()}
      {view === AppView.GAME && (
        <div className="min-h-screen bg-sky-50 py-8">
           <Game 
              vocabList={vocabList} 
              mode={gameConfig?.mode || GameMode.HANZI_MEANING}
              onExit={() => setView(AppView.DASHBOARD)}
              onRestart={handleRestart}
              onNext={handleNextLevel}
           />
        </div>
      )}
    </div>
  );
};

export default App;