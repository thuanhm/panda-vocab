# 🐼 PandaVocab - Game Học Từ Vựng Tiếng Trung

Ứng dụng học từ vựng HSK 1-9 với trò chơi ghép thẻ dễ thương!

## ✨ Tính Năng

- 📚 Luyện tập từ vựng HSK 1-9 với AI
- 🎮 Chơi game ghép thẻ (Hán tự ↔ Pinyin / Nghĩa)
- 📥 Nhập từ vựng từ file Excel
- 💾 Quản lý danh sách từ vựng riêng
- 🎨 Giao diện dễ thương với hiệu ứng đẹp mắt

## 🚀 Hướng Dẫn Triển Khai Lên Vercel

### Bước 1: Lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Nhấn **"Create API Key"**
4. Copy API key (giữ kín, đừng chia sẻ!)

### Bước 2: Deploy Lên Vercel

1. Truy cập: https://vercel.com
2. Nhấn **"Sign Up"** và chọn **"Continue with GitHub"**
3. Sau khi đăng nhập, nhấn **"Add New..."** → **"Project"**
4. Chọn repository `panda-vocab` (hoặc tên bạn đặt)
5. Nhấn **"Import"**

### Bước 3: Cấu Hình Environment Variables

Trước khi deploy, thêm biến môi trường:

1. Trong màn hình import project, tìm phần **"Environment Variables"**
2. Thêm biến:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Dán API key bạn vừa lấy ở bước 1
3. Nhấn **"Deploy"**

### Bước 4: Chờ Deploy Xong

- Vercel sẽ build app (mất khoảng 2-3 phút)
- Sau khi xong, bạn sẽ thấy nút **"Visit"**
- Nhấn vào để mở app của bạn!

## 🎮 Cách Sử Dụng

1. **Đăng nhập**: Nhấn nút "Đăng nhập bằng Google" (demo, không cần tài khoản thật)
2. **Luyện HSK**: Chọn cấp độ HSK và chế độ chơi
3. **Tạo danh sách**: Tạo danh sách từ vựng riêng và nhập file Excel
4. **Chơi game**: Ghép các thẻ Hán tự với Pinyin hoặc nghĩa tương ứng

## 📝 Format File Excel

Để nhập từ vựng, file Excel cần có 3 cột:

| Hán tự | Pinyin | Nghĩa |
|--------|--------|-------|
| 你好 | nǐ hǎo | Xin chào |
| 再见 | zàijiàn | Tạm biệt |

## 🛠️ Chạy Local

```bash
# Clone repository
git clone https://github.com/your-username/panda-vocab.git
cd panda-vocab

# Cài dependencies
npm install

# Tạo file .env.local và thêm API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Chạy dev server
npm run dev
```

## 📦 Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- Google Gemini AI
- SheetJS (xlsx)
- Canvas Confetti

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa!

---

Made with ❤️ by Gấu Trúc Nhỏ 🐼
