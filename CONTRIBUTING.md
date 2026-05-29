# Đóng góp cho TopTrending VN

Cảm ơn bạn đã quan tâm đến dự án! Mọi đóng góp — dù nhỏ hay lớn — đều được chào đón và trân trọng.

---

## 📋 Mục lục

- [Quy tắc ứng xử](#-quy-tắc-ứng-xử)
- [Cách đóng góp](#-cách-đóng-góp)
- [Báo cáo lỗi](#-báo-cáo-lỗi)
- [Đề xuất tính năng](#-đề-xuất-tính-năng)
- [Quy trình Pull Request](#-quy-trình-pull-request)
- [Phong cách code](#-phong-cách-code)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)

---

## 🤝 Quy tắc ứng xử

- Tôn trọng và lịch sự với tất cả mọi người trong cộng đồng.
- Không phân biệt đối xử dưới bất kỳ hình thức nào.
- Mọi tranh luận cần dựa trên kỹ thuật và có cơ sở, không mang tính cá nhân.
- Phản hồi mang tính xây dựng; nếu không đồng ý, hãy giải thích lý do.

---

## 🚀 Cách đóng góp

### Môi trường phát triển

Xem hướng dẫn tại [README.md](README.md#-chạy-local) để cài đặt và chạy local.

### Fork & Clone

```bash
# 1. Fork repo trên GitHub (nhấn nút "Fork")

# 2. Clone fork của bạn
git clone https://github.com/<your-username>/TopTrending-VN.git
cd TopTrending-VN

# 3. Thêm upstream remote
git remote add upstream https://github.com/huyvu2512/TopTrending-VN.git

# 4. Cài đặt dependencies
npm install

# 5. Tạo branch mới cho tính năng / fix của bạn
git checkout -b feat/ten-tinh-nang
# hoặc
git checkout -b fix/ten-loi
```

---

## 🐛 Báo cáo lỗi

Trước khi tạo Issue mới, vui lòng:

1. **Kiểm tra** [Issues hiện có](https://github.com/huyvu2512/TopTrending-VN/issues) để tránh trùng lặp.
2. Đảm bảo bạn đang dùng phiên bản mới nhất.

**Khi tạo Issue, cung cấp:**

- **Môi trường:** Trình duyệt, hệ điều hành, thiết bị (desktop / mobile)
- **Mô tả lỗi:** Rõ ràng, ngắn gọn
- **Cách tái hiện:** Các bước từng bước để tái hiện lỗi
- **Kết quả mong đợi** vs **Kết quả thực tế**
- **Screenshot / Video** (nếu có, đặc biệt với lỗi UI)

---

## 💡 Đề xuất tính năng

Mở một Issue với label `enhancement` và mô tả:

- **Vấn đề** bạn đang gặp phải (hoặc cơ hội cải thiện)
- **Giải pháp** bạn đề xuất
- **Lý do** tính năng này hữu ích với người dùng khác
- **Mockup / Ví dụ** (nếu có)

---

## 🔀 Quy trình Pull Request

1. **Đồng bộ** branch của bạn với `main` trước khi submit:

    ```bash
    git fetch upstream
    git rebase upstream/main
    ```

2. **Test** kỹ lưỡng thay đổi của bạn trên cả desktop và mobile trước khi tạo PR.

3. **Commit** theo quy ước:

    ```
    feat: thêm tính năng lọc theo ngày
    fix: sửa lỗi video không tải trên Safari iOS
    style: cải thiện responsive cho màn hình nhỏ
    docs: cập nhật README hướng dẫn cài đặt
    refactor: tách logic render modal thành hàm riêng
    chore: cập nhật dependencies
    ```

4. **Tạo Pull Request** với:
    - Tiêu đề rõ ràng, mô tả đúng nội dung thay đổi
    - Mô tả những gì đã thay đổi và lý do
    - Link tới Issue liên quan (nếu có): `Closes #<issue-number>`
    - Screenshots trước/sau (nếu là thay đổi UI)

5. Đợi review. Bạn có thể được yêu cầu chỉnh sửa — đây là quá trình bình thường, không phải từ chối.

---

## ✍️ Phong cách code

### HTML

- Dùng tag ngữ nghĩa (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`...)
- Thêm `alt` cho tất cả thẻ `<img>`
- ID phải duy nhất và mô tả rõ chức năng

### CSS

- CSS thuần (Vanilla CSS), **không** dùng TailwindCSS hay pre-processor
- Dùng CSS Custom Properties (`--var-name`) cho màu sắc và giá trị tái sử dụng
- Ưu tiên `flexbox` và `grid` cho layout
- Responsive đầu tiên: viết mobile rồi mới media query lên desktop

### JavaScript

- Vanilla JS (ES Modules, `type="module"`)
- Đặt tên biến/hàm theo camelCase, rõ nghĩa
- Ưu tiên `const`, chỉ dùng `let` khi giá trị thực sự thay đổi
- Tránh callback hell — dùng `async/await`
- Comment bằng tiếng Việt hoặc tiếng Anh, miễn là nhất quán trong file

### Dữ liệu

- **Không** chỉnh sửa `public/data.json` bằng tay — file này do script `fetch_data.js` tự sinh.
- Mọi thay đổi schema dữ liệu cần cập nhật đồng thời cả `scripts/fetch_data.js` và `public/app.js`.

---

## 📁 Cấu trúc dự án

Xem chi tiết tại [README.md](README.md#️-kiến-trúc-dự-án).

| File | Vai trò |
|---|---|
| `public/app.js` | Logic frontend: routing, render, modal, filter, share |
| `public/style.css` | Toàn bộ styling — dark theme, responsive |
| `public/index.html` | SPA entry point, PWA meta tags |
| `scripts/fetch_data.js` | Cào dữ liệu từ YouTube API, tính toán thứ hạng & biến động |
| `server.js` | Express server cho local dev |
| `.github/workflows/update_data.yml` | GitHub Actions CI/CD |

---

## ❓ Có câu hỏi?

- 💬 Mở [Discussion](https://github.com/huyvu2512/TopTrending-VN/discussions)
- 📬 Liên hệ tác giả: [beacons.ai/huyvu2512](https://beacons.ai/huyvu2512)
