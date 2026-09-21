# Mail API Service - UEF KHCN Mailer

Dịch vụ API gửi Email tự động phục vụ Hệ thống Quản lý Đề tài Nghiên cứu Khoa học (NCKH) cấp trường của Cán bộ - Giảng viên - Nhân viên tại **Trường Đại học Kinh tế - Tài chính TP.HCM (UEF)**.

Dự án được xây dựng bằng **Node.js Express.js**, sử dụng thư viện **Nodemailer** kết nối qua SMTP Gmail và hỗ trợ biên dịch đóng gói tối giản (single bundle) để chạy trực tiếp trên **IIS (Internet Information Services)** thông qua module **iisnode**.

---

## Các Tính Năng Chính

Cung cấp các API Endpoint (phiên bản `v1`) để gửi các mẫu email HTML chuẩn hóa:

- **Thông báo tình trạng đề tài**: Gửi kết quả xét duyệt/nghiệm thu đề tài KHCN.
- **Thư mời phản biện đề cương**: Thư mời tham gia hội đồng nhận xét đề cương nghiên cứu (hỗ trợ kèm tin nhắn/ghi chú bổ sung).
- **Thư mời nghiệm thu**: Thư mời nghiệm thu bài báo NCKH (hỗ trợ kèm tin nhắn/ghi chú bổ sung).
- **Thư nhắc nhở**: Gửi email nhắc nhở phản biện hoặc nghiệm thu định kỳ tới danh sách người nhận.
- **Thư cảm ơn**: Gửi thư cảm ơn Thầy/Cô sau khi hoàn thành đánh giá xét duyệt đề tài.

---

## Yêu Cầu Hệ Thống (Requirements)

### Môi trường Phát triển (Development)

- **Node.js**: Phiên bản LTS mới nhất (Khuyên dùng v18 hoặc v20).
- **npm**: Quản lý gói thư viện (đi kèm Node.js).

### Môi trường Triển khai (Production - IIS Server)

- **Hệ điều hành**: Windows Server (2016, 2019, 2022...) hoặc Windows 10/11 chuyên dụng.
- **IIS (Internet Information Services)**: Đã bật tính năng Web Server.
- **IIS URL Rewrite Module**: Để xử lý định tuyến (Routing).
- **iisnode**: Module hỗ trợ chạy Node.js trên IIS.
- **Node.js**: Cài đặt trực tiếp trên Windows Server.

---

## Hướng Dẫn Phát Triển Dưới Local (Local Development)

1. **Cài đặt các gói thư viện**:

   ```bash
   npm install
   ```

2. **Chạy ứng dụng trong chế độ Development**:

   ```bash
   npm run dev
   ```

   Ứng dụng sẽ khởi chạy tại: `http://localhost:5174`

3. **Cơ cấu API Endpoint để test**:
   - `POST http://localhost:5174/v1/send-email/thong-bao-tinh-trang-de-tai-khcn`
   - `POST http://localhost:5174/v1/send-email/gui-phan-bien`
   - `POST http://localhost:5174/v1/send-email/gui-phan-bien-kem-tin-nhan`
   - `POST http://localhost:5174/v1/send-email/nhac-nho-phan-bien`
   - `POST http://localhost:5174/v1/send-email/cam-on-phan-bien`
   - `POST http://localhost:5174/v1/send-email/gui-nghiem-thu`
   - `POST http://localhost:5174/v1/send-email/gui-nghiem-thu-kem-tin-nhan`
   - `POST http://localhost:5174/v1/send-email/nhac-nho-nghiem-thu`

---

## Hướng Dẫn Đóng Gói (Build)

Dự án áp dụng phương pháp **Bundling** nhằm tối ưu hóa việc phân phối mã nguồn. Khi chạy build, toàn bộ code từ `node_modules` và các file `.js` nội bộ sẽ được gộp chung thành một file duy nhất `index.js`, giúp việc upload và triển khai lên IIS cực kỳ nhanh chóng (không cần copy thư mục `node_modules` khổng lồ).

Để đóng gói dự án:

```bash
npm run build
```

Sau khi chạy lệnh trên, thư mục `dist/` sẽ được sinh ra với cấu trúc:

```
dist/
├── template/                     # Chứa các file HTML giao diện email
│   ├── cam-on-phan-bien.html
│   └── ...
├── index.js                      # Bản build Javascript duy nhất chứa toàn bộ logic
└── web.config                    # Cấu hình định tuyến và xử lý dành riêng cho IIS
```

---

## Hướng Dẫn Triển Khai Lên IIS (Deployment)

1. **Chuẩn bị Server**: Đảm bảo Server đã cài đặt **IIS**, **URL Rewrite Module**, **Node.js** và **iisnode**.
2. **Copy file**: Copy toàn bộ nội dung **bên trong** thư mục `dist/` vừa build vào thư mục vật lý của website trên server (Ví dụ: `C:\inetpub\wwwroot\uefmailer`).
3. **Phân quyền thư mục**:
   - Click chuột phải vào thư mục chạy web > Chọn **Properties** > Tab **Security** > Chọn **Edit**.
   - Thêm nhóm người dùng `IIS_IUSRS` và cấp các quyền: _Read_, _Write_, _Read & Execute_, _List folder contents_. (Quyền _Write_ rất quan trọng để `iisnode` ghi log).
4. **Tạo Website trên IIS**:
   - Mở **IIS Manager** > Click chuột phải vào **Sites** > Chọn **Add Website**.
   - Cấu hình tên Site, port chạy và trỏ **Physical Path** trực tiếp vào thư mục chứa code đã copy ở bước 2.
5. **Kiểm tra hoạt động**: Truy cập vào hostname hoặc port đã cấu hình (Ví dụ: `http://localhost:5174`) để kiểm tra phản hồi từ API.

---

## Cấu Hình Gửi Mail (SMTP Configuration)

Cấu hình tài khoản gửi mail được khai báo trực tiếp trong tệp tin `utils/sendEmail.js`. Trong môi trường sản xuất, bạn nên đảm bảo các thông số SMTP (host, port, auth) và Mật khẩu ứng dụng (App Password) của Gmail được cấu hình chính xác và bảo mật.

---

## Nhật Ký Hoạt Động (Logs)

Khi chạy trên IIS, nếu ứng dụng phát sinh lỗi crash hoặc các lỗi kết nối từ Node.js, bạn có thể kiểm tra các file log được tạo tự động tại đường dẫn:

```
C:\inetpub\wwwroot\uefmailer\iisnode\*.txt
```

_(Thư mục `iisnode` được sinh ra tự động cùng cấp với `index.js` khi có lỗi xảy ra)._
