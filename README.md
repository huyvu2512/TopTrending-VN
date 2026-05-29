<div align="center">

# 🔥 TopTrending VN

**Theo dõi & phân tích video đang thịnh hành trên YouTube Việt Nam — cập nhật tự động mỗi 30 phút.**

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4-000000?logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla%20JS-ES2022-F7DF1E?logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

🌐 **[toptrendingvn](https://toptrendingvn.vercel.app/)** · 📦 **[GitHub](https://github.com/huyvu2512/TopTrending-VN)** · 👤 **[Liên hệ](https://beacons.ai/huyvu2512)**

---

### 📊 Thống Kê Dự Án

[![Stars](https://img.shields.io/github/stars/huyvu2512/TopTrending-VN?style=flat-square&label=⭐%20Stars&color=FFCC00)](https://github.com/huyvu2512/TopTrending-VN/stargazers)
[![Forks](https://img.shields.io/github/forks/huyvu2512/TopTrending-VN?style=flat-square&label=🍴%20Forks&color=6e7681)](https://github.com/huyvu2512/TopTrending-VN/forks)
[![Issues](https://img.shields.io/github/issues/huyvu2512/TopTrending-VN?style=flat-square&label=🐛%20Issues&color=f85149)](https://github.com/huyvu2512/TopTrending-VN/issues)
[![Last Commit](https://img.shields.io/github/last-commit/huyvu2512/TopTrending-VN?style=flat-square&label=🕐%20Cập%20nhật&color=3fb950)](https://github.com/huyvu2512/TopTrending-VN/commits/main)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=huyvu2512.TopTrending-VN&left_text=👁%20Lượt%20xem&left_color=6e7681&right_color=FF0000)

</div>

---

## ⚠️ Tuyên bố miễn trách nhiệm

> **Dự án này được xây dựng hoàn toàn vì mục đích học tập và phi lợi nhuận.**
>
> - Toàn bộ dữ liệu (tên video, thumbnail, lượt xem...) được lấy từ **YouTube Data API v3** — API chính thức do Google cung cấp và công khai.
> - Dự án **không** lưu trữ, phân phối lại hay tái bản bất kỳ nội dung video nào của YouTube.
> - Dự án **không** có mục đích thương mại, không kinh doanh, không thu phí dưới bất kỳ hình thức nào.
> - Mọi nhãn hiệu, thương hiệu, và nội dung liên quan đến YouTube / Google đều thuộc sở hữu của **Google LLC**.
> - Nếu có bất kỳ lo ngại nào về quyền sở hữu trí tuệ, vui lòng liên hệ tác giả để xử lý.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🔥 **Top 3 nổi bật** | 3 video trending hàng đầu được hiển thị nổi bật với card lớn và badge riêng |
| 📊 **Phân tích dữ liệu** | Xem lượt xem, lượt thích, bình luận và tốc độ xem/giờ cho từng video |
| 📈 **Thông số biến động** | Hiển thị mức tăng/giảm hạng (▲ / ▼) so với lần cập nhật trước |
| 🆕 **Nhãn video mới** | Badge "NEW" nổi bật cho các video xuất hiện trong vòng 3 ngày |
| 🗂️ **4 danh mục** | Tổng hợp · Âm nhạc · Shorts · Trò chơi |
| 🔗 **Clean URL** | Mỗi video có URL riêng dạng `/[videoId]`, có thể chia sẻ và bookmark |
| 📱 **PWA** | Cài đặt lên màn hình chính iOS / Android với icon và tên **TopTrending VN** |
| 🌙 **Dark mode** | Giao diện tối hoàn toàn, tối ưu cho mọi thiết bị |
| ⚡ **Cập nhật tự động** | GitHub Actions chạy mỗi 30 phút, tự commit `data.json` lên repo |
| 📤 **Chia sẻ nhanh** | Web Share API — chia sẻ link video trực tiếp lên mọi ứng dụng |

---

## 🖥️ Xem trước

> **Live:** [https://toptrendingvn.vercel.app/](https://toptrendingvn.vercel.app/)

---

## 🏗️ Kiến trúc dự án

```
TopTrending VN/
├── .github/
│   └── workflows/
│       └── update_data.yml     # GitHub Actions: tự động cào & commit dữ liệu mỗi 30 phút
├── public/
│   ├── assets/
│   │   └── images/             # Logo, banner chia sẻ
│   ├── app.js                  # Toàn bộ logic frontend (routing, render, modal, filter...)
│   ├── style.css               # Giao diện — CSS thuần, dark theme, responsive
│   ├── index.html              # SPA entry point với PWA meta tags
│   ├── manifest.json           # PWA Web App Manifest
│   └── data.json               # Dữ liệu trending (auto-generated, không sửa tay)
├── scripts/
│   └── fetch_data.js           # Script cào dữ liệu từ YouTube Data API v3
├── server.js                   # Express server (local dev + path-based routing)
├── vercel.json                 # Cấu hình deploy Vercel (rewrites cho SPA routing)
├── .env.example                # Mẫu biến môi trường
├── .gitignore
└── package.json
```

---

## 🚀 Chạy local

### 1. Clone & cài đặt

```bash
git clone https://github.com/huyvu2512/TopTrending-VN.git
cd TopTrending-VN
npm install
```

### 2. Cấu hình API Key

```bash
# Sao chép file mẫu
cp .env.example .env
```

Mở file `.env` và điền API Key của bạn:

```env
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
```

> **Lấy API Key:** Truy cập [Google Cloud Console](https://console.cloud.google.com/) → tạo project → bật **YouTube Data API v3** → tạo **API Key**.

### 3. Cào dữ liệu lần đầu

```bash
npm run fetch
```

Lệnh này sẽ gọi `scripts/fetch_data.js`, lấy top 50 video trending từ 4 danh mục và lưu vào `public/data.json`.

### 4. Khởi động server

```bash
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Cập nhật dữ liệu

### Tự động (GitHub Actions)

File `.github/workflows/update_data.yml` chạy mỗi 30 phút:

1. Checkout code
2. Cài dependencies
3. Chạy `npm run fetch` (cần secret `YOUTUBE_API_KEY` trong repo Settings)
4. Commit & push `public/data.json` nếu có thay đổi

**Thiết lập secret:**  
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`  
Tên: `YOUTUBE_API_KEY`, Giá trị: API Key của bạn.

### Thủ công (qua API)

Khi server đang chạy, gọi:

```
GET http://localhost:3000/api/fetch
```

---

## 🌐 Deploy lên Vercel

1. **Import** repo lên [vercel.com](https://vercel.com)
2. Thêm **Environment Variable:** `YOUTUBE_API_KEY = <your_key>`
3. Vercel tự detect cấu hình từ `vercel.json` và deploy

File `vercel.json` đã cấu hình rewrites để SPA routing hoạt động đúng (URL dạng `/videoId` không bị 404).

---

## 📦 Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Khởi động Express server ở port 3000 |
| `npm run fetch` | Cào dữ liệu mới từ YouTube API và ghi vào `data.json` |

---

## 🛠️ Công nghệ sử dụng

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3%20Vanilla-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube%20Data%20API%20v3-FF0000?style=for-the-badge&logo=youtube&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Inter%20Font-4285F4?style=for-the-badge&logo=google-fonts&logoColor=white)

</div>

---

## 📬 Liên hệ & đóng góp

- 🌐 **Website:** [https://toptrendingvn.vercel.app/](https://toptrendingvn.vercel.app/)
- 👤 **Tác giả:** [beacons.ai/huyvu2512](https://beacons.ai/huyvu2512)
- 🐛 **Bug / Feature:** [Mở Issue](https://github.com/huyvu2512/TopTrending-VN/issues)
- 🤝 **Đóng góp:** Xem [CONTRIBUTING.md](CONTRIBUTING.md)
- 🔒 **Bảo mật:** Xem [SECURITY.md](SECURITY.md)

---

## 📄 Giấy phép

Dự án được phân phối theo giấy phép **MIT**. Xem chi tiết tại [LICENSE](LICENSE).
