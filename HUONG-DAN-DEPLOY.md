# 📖 HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL - CHI TIẾT TỪNG BƯỚC

## 📌 CHUẨN BỊ

Trước khi bắt đầu, bạn cần:
1. ✅ Tài khoản GitHub (miễn phí)
2. ✅ Tài khoản Google (để lấy Gemini API Key)
3. ✅ Code của game (bạn đã có rồi!)

---

## 🔑 BƯỚC 1: LẤY GEMINI API KEY (5 phút)

### Tại sao cần API Key?
Game sử dụng AI của Google Gemini để tạo từ vựng HSK tự động. API Key giống như "chìa khóa" để app của bạn gọi AI.

### Các bước lấy:

1. **Mở trình duyệt** → vào: https://aistudio.google.com/app/apikey

2. **Đăng nhập** bằng tài khoản Google của bạn

3. Bạn sẽ thấy màn hình "API keys"
   - Nhấn nút xanh **"Create API Key"**
   - Chọn **"Create API key in new project"**

4. **QUAN TRỌNG**: Copy API key vừa tạo
   - Nó sẽ có dạng: `AIzaSyXXXXXXXXXXXXXXXXXXXXX`
   - Lưu vào Notepad hoặc Notes
   - ⚠️ **KHÔNG chia sẻ key này với ai!**

5. ✅ Xong! Giữ key này, bạn sẽ cần dùng ở bước sau.

---

## 📦 BƯỚC 2: TẢI CODE LÊN GITHUB (10 phút)

### A. Tạo Tài Khoản GitHub (nếu chưa có)

1. Vào: https://github.com
2. Nhấn **"Sign up"** (góc trên bên phải)
3. Điền thông tin:
   - Email của bạn
   - Mật khẩu (ít nhất 15 ký tự hoặc 8 ký tự có chữ số)
   - Username (tên người dùng, VD: panda-coder-123)
4. Xác nhận email → ✅ Xong!

### B. Tạo Repository (Kho Lưu Code)

1. **Đăng nhập GitHub** → nhấn dấu **"+"** (góc trên bên phải)
2. Chọn **"New repository"**

3. **Điền thông tin:**
   ```
   Repository name: panda-vocab
   Description: Game học từ vựng tiếng Trung
   ☑️ Public (Công khai)
   ☑️ Add a README file (Tick vào ô này)
   ```

4. Nhấn nút xanh **"Create repository"** → ✅ Repository đã được tạo!

### C. Tải Code Lên Repository

Có 2 cách: **Cách 1 (Dễ - Dùng Web)** hoặc **Cách 2 (Pro - Dùng Git)**

#### 🟢 CÁCH 1: Tải Lên Qua Web (Dễ Nhất - Khuyên Dùng)

1. Ở trang repository vừa tạo, nhấn nút **"Add file"** → **"Upload files"**

2. **Kéo thả** hoặc chọn tất cả các file trong thư mục `panda-vocab-deploy` (tôi đã tạo cho bạn):
   ```
   - App.tsx
   - index.html
   - index.tsx
   - package.json
   - tsconfig.json
   - types.ts
   - vite.config.ts
   - vercel.json
   - .gitignore
   - .env.example
   - README.md
   - metadata.json
   - và tất cả các file/folder khác
   ```

3. ⚠️ **QUAN TRỌNG**: KHÔNG tải file `.env.local` (file chứa API key) lên GitHub!
   - File này chỉ dùng local, không được public

4. Kéo xuống dưới, điền vào ô "Commit changes":
   ```
   Initial commit - PandaVocab game
   ```

5. Nhấn **"Commit changes"** → ✅ Code đã lên GitHub!

#### 🔵 CÁCH 2: Dùng Git (Nếu Bạn Biết Dùng Terminal)

```bash
# Clone repository vừa tạo
git clone https://github.com/[username]/panda-vocab.git
cd panda-vocab

# Copy tất cả file từ thư mục panda-vocab-deploy vào đây
# (Trừ file .env.local)

# Add và commit
git add .
git commit -m "Initial commit - PandaVocab game"
git push origin main
```

---

## 🚀 BƯỚC 3: DEPLOY LÊN VERCEL (5 phút)

### A. Tạo Tài Khoản Vercel

1. Vào: https://vercel.com
2. Nhấn **"Sign Up"** (góc trên bên phải)
3. Chọn **"Continue with GitHub"** (Đăng nhập bằng GitHub)
4. **Authorize Vercel** → cho phép Vercel truy cập GitHub của bạn
5. ✅ Xong! Bạn đã có tài khoản Vercel

### B. Import Project Từ GitHub

1. Sau khi đăng nhập Vercel, bạn sẽ thấy Dashboard
2. Nhấn nút **"Add New..."** (hoặc "New Project")
3. Chọn **"Project"**

4. Bạn sẽ thấy danh sách repositories từ GitHub
   - Tìm repository **"panda-vocab"**
   - Nhấn nút **"Import"** bên cạnh tên repository

### C. Cấu Hình Environment Variables

**ĐÂY LÀ BƯỚC QUAN TRỌNG NHẤT!**

1. Trong màn hình "Configure Project", kéo xuống tìm mục **"Environment Variables"**

2. Thêm biến môi trường:
   ```
   KEY (tên biến): GEMINI_API_KEY
   VALUE (giá trị): [Dán API key bạn lấy ở Bước 1]
   ```
   
3. Nhấn **"Add"** để thêm biến

4. **Kiểm tra lại:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSy...` (API key của bạn)
   - Environment: All (Production, Preview, Development)

### D. Deploy!

1. Sau khi thêm Environment Variables, nhấn nút **"Deploy"** (màu xanh dương)

2. **Chờ đợi** (khoảng 2-3 phút):
   - Vercel sẽ:
     - ⚙️ Install dependencies (cài thư viện)
     - 🔨 Build project (build code)
     - 🚀 Deploy (đưa lên server)

3. Bạn sẽ thấy animation pháo hoa 🎉 khi deploy thành công!

4. **Nhấn nút "Visit"** để mở app của bạn!

---

## 🎯 BƯỚC 4: KIỂM TRA APP

1. **Mở link** mà Vercel cung cấp (dạng: `https://panda-vocab.vercel.app`)

2. **Kiểm tra các tính năng:**
   - ✅ Trang đăng nhập hiển thị đúng
   - ✅ Nhấn "Đăng nhập bằng Google" → vào Dashboard
   - ✅ Thử chọn HSK 1 → Game sẽ tạo từ vựng bằng AI
   - ✅ Thử tạo danh sách và upload file Excel

3. **Nếu gặp lỗi:**
   - Kiểm tra lại GEMINI_API_KEY đã nhập đúng chưa
   - Xem logs trong Vercel Dashboard → Tab "Deployments" → Nhấn vào deployment → "View Function Logs"

---

## 🔧 CẬP NHẬT CODE SAU NÀY

Khi bạn muốn sửa code:

### Cách 1: Sửa Trực Tiếp Trên GitHub
1. Vào repository trên GitHub
2. Chọn file muốn sửa
3. Nhấn nút "Edit" (biểu tượng bút chì)
4. Sửa code → Nhấn "Commit changes"
5. Vercel sẽ **tự động deploy lại** sau vài giây!

### Cách 2: Dùng Git (Nếu Biết)
```bash
# Sửa code trong máy
# Sau đó:
git add .
git commit -m "Update feature XYZ"
git push origin main

# Vercel tự động deploy!
```

---

## ❓ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Build Failed"
**Nguyên nhân:** Thiếu dependencies hoặc code lỗi
**Giải pháp:**
1. Kiểm tra file `package.json` đã đầy đủ dependencies chưa
2. Xem logs trong Vercel để tìm lỗi cụ thể

### Lỗi: "API Key Invalid" hoặc từ vựng không tạo được
**Nguyên nhân:** API Key sai hoặc chưa set
**Giải pháp:**
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Kiểm tra lại `GEMINI_API_KEY`
3. Nếu sai, sửa lại và **Redeploy** (nút "Redeploy" trong tab Deployments)

### Lỗi: "404 Not Found" khi reload trang
**Nguyên nhân:** Thiếu cấu hình rewrite
**Giải pháp:** File `vercel.json` đã có sẵn config, không cần lo!

### Lỗi: Import file Excel không hoạt động
**Nguyên nhân:** Thư viện `xlsx` chưa được cài
**Giải pháp:** Đã có trong `package.json`, Vercel sẽ tự cài

---

## 🎨 TÙY CHỈNH DOMAIN (Tùy Chọn)

Mặc định, Vercel cho bạn domain: `panda-vocab.vercel.app`

Muốn đổi thành tên khác:

1. Vào Project Settings → Domains
2. Nhấn "Add" → nhập tên mới (VD: `my-panda-game.vercel.app`)
3. Hoặc kết nối domain riêng của bạn (nếu có mua)

---

## 📊 THEO DÕI TRAFFIC

1. Vào Vercel Dashboard → Chọn project
2. Tab "Analytics" → xem số người truy cập, tốc độ load...
3. Miễn phí cho đến 100GB bandwidth/tháng!

---

## 💡 MẸO HAY

### Mẹo 1: Tắt/Bật Deploy Tự Động
- Vercel Settings → Git → Tắt "Auto Deploy" nếu không muốn deploy mỗi lần push code

### Mẹo 2: Tạo Preview Deploy
- Mỗi khi push code lên branch khác (không phải `main`), Vercel tạo preview link để test

### Mẹo 3: Rollback Nếu Deploy Lỗi
- Tab Deployments → Chọn version cũ → Nhấn "Promote to Production"

---

## 🆘 CẦN TRỢ GIÚP?

Nếu gặp vấn đề:
1. 📧 Xem logs trong Vercel Dashboard
2. 🔍 Google lỗi cụ thể
3. 💬 Hỏi trên Discord/Forum React/Vercel

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đã lấy Gemini API Key
- [ ] Đã tạo repository trên GitHub
- [ ] Đã upload code lên GitHub
- [ ] Đã tạo tài khoản Vercel
- [ ] Đã import project từ GitHub
- [ ] Đã thêm Environment Variables (GEMINI_API_KEY)
- [ ] Đã deploy thành công
- [ ] Đã test app hoạt động đúng
- [ ] 🎉 HOÀN THÀNH!

---

**Chúc bạn deploy thành công! 🐼✨**

Nếu có thắc mắc gì, cứ hỏi tôi nhé!
