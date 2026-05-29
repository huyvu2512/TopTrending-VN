# Chính sách bảo mật (Security Policy)

## 🔒 Phiên bản được hỗ trợ

Chúng tôi chỉ cung cấp bản vá bảo mật cho phiên bản mới nhất trên nhánh `main`.

| Phiên bản | Được hỗ trợ |
|---|---|
| `main` (latest) | ✅ Có |
| Các nhánh cũ | ❌ Không |

---

## 🚨 Báo cáo lỗ hổng bảo mật

**Không tạo Issue công khai** khi phát hiện lỗ hổng bảo mật — điều này có thể gây nguy hiểm trước khi chúng tôi kịp xử lý.

### Cách báo cáo

Vui lòng liên hệ trực tiếp qua:

- 📬 **Liên hệ tác giả:** [beacons.ai/huyvu2512](https://beacons.ai/huyvu2512)
- 🔒 **GitHub Private Security Advisory:** [Báo cáo bảo mật riêng tư](https://github.com/huyvu2512/TopTrending-VN/security/advisories/new)

### Thông tin cần cung cấp

Để chúng tôi xử lý nhanh nhất, hãy cung cấp:

1. **Mô tả** lỗ hổng (loại lỗi, mức độ nghiêm trọng ước tính)
2. **Các bước tái hiện** chi tiết
3. **Phạm vi ảnh hưởng** (ai có thể bị ảnh hưởng, dữ liệu nào có thể bị lộ)
4. **Môi trường** (trình duyệt, OS, URL)
5. **Proof of Concept** (nếu có, xin gửi riêng tư)

---

## ⏱️ Quy trình xử lý

| Bước | Thời gian dự kiến |
|---|---|
| Xác nhận nhận báo cáo | Trong vòng 48 giờ |
| Đánh giá mức độ nghiêm trọng | Trong vòng 7 ngày |
| Phát hành bản vá | Tùy thuộc vào độ phức tạp |
| Công bố (disclosure) | Sau khi bản vá được triển khai |

---

## 🛡️ Phạm vi bảo mật

### Trong phạm vi (In-scope)

- Lỗ hổng trong logic `public/app.js` (XSS, DOM injection...)
- Lỗ hổng trong `server.js` (path traversal, endpoint abuse...)
- Lộ lọt API Key hoặc thông tin nhạy cảm
- Lỗ hổng trong GitHub Actions workflow

### Ngoài phạm vi (Out-of-scope)

- Lỗi bảo mật của Vercel hoặc GitHub (báo cáo thẳng cho họ)
- Lỗi bảo mật của YouTube Data API v3 (báo cáo cho Google)
- Tấn công social engineering nhắm vào người dùng cuối
- Lỗi trong `public/data.json` (file này do YouTube API tự sinh)

---

## 🙏 Ghi nhận đóng góp

Chúng tôi trân trọng mọi báo cáo bảo mật có trách nhiệm. Những người báo cáo lỗ hổng hợp lệ sẽ được ghi nhận trong changelog và/hoặc README (nếu bạn đồng ý).

---

## 📄 Luật áp dụng

Chính sách này không cấu thành một chương trình Bug Bounty chính thức. Mọi nghiên cứu bảo mật phải tuân theo pháp luật Việt Nam và quốc tế.
