# Assets KHCN - Express.js API Service

Dự án cung cấp dịch vụ API lưu trữ tài nguyên khoa học công nghệ, bao gồm các tính năng tải lên (upload) tệp tin, ảnh đại diện, chứng chỉ và tự động tạo chứng chỉ dạng hình ảnh sử dụng thư viện `canvas`.

Dự án đã được cấu hình tối ưu để đóng gói thành một thư mục phân phối duy nhất (`dist-package`), giúp triển khai trực tiếp lên IIS (thông qua module **iisnode**) mà không cần thực hiện bước cài đặt thư viện (`npm install`) trên máy chủ production.

---

## Yêu cầu hệ thống

- **Môi trường phát triển & Đóng gói:**
  - Node.js (Khuyến nghị bản v20 trở lên, dự án đã được kiểm thử trên `v22.11.0`)
  - NPM (đi kèm Node.js)
- **Môi trường triển khai (IIS Server):**
  - Windows Server (hoặc Windows Desktop hỗ trợ IIS)
  - IIS (Internet Information Services) đã bật tính năng **URL Rewrite**
  - Module **iisnode** cho IIS (Tải xuống từ IISNode GitHub)
  - Node.js tương thích với phiên bản dùng để đóng gói (Khuyến nghị cài cùng phiên bản Node.js với môi trường phát triển)

---

## Hướng dẫn phát triển (Development)

1. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
2. Khởi chạy ứng dụng trong môi trường phát triển:
   ```bash
   npm run dev
   ```
   _Mặc định ứng dụng sẽ chạy tại cổng `5174` (hoặc cổng được cấu hình qua biến môi trường `PORT`)._

---

## Hướng dẫn đóng gói (Build)

Để chuẩn bị phiên bản deploy tối ưu hóa cho IIS mà không cần cài đặt thư viện trên server, hãy chạy lệnh sau tại thư mục gốc của dự án:

```bash
npm run build
```

### Cách thức hoạt động của quá trình Build:

1. **Dọn dẹp thư mục**: Xóa và tạo mới thư mục `dist-package`.
2. **Bundling**: Công cụ `esbuild` tự động gộp toàn bộ mã nguồn JS và các dependency thuần JS (`express`, `cors`, `multer`...) vào một file duy nhất `dist-package/app.js` để tăng tốc độ load và giảm dung lượng.
3. **Cấu hình IIS**: Sao chép file `web.config` sang thư mục `dist-package`.
4. **Xử lý Native Module**: Do thư viện `canvas` chứa các thành phần nhị phân (`.node`) và các file DLL của Windows, nó không thể gộp vào file JS đơn lẻ. Kịch bản build sẽ tự động sao chép toàn bộ thư mục `node_modules/canvas` vào thư mục đích `dist-package/node_modules/canvas`.

---

## Hướng dẫn triển khai lên IIS (Deploy)

Sau khi chạy lệnh `npm run build`, bạn chỉ cần sử dụng nội dung trong thư mục `dist-package` để triển khai lên máy chủ IIS:

1. **Sao chép thư mục**: Nén và tải thư mục `dist-package` lên máy chủ. Giải nén vào thư mục ứng dụng trên máy chủ (ví dụ: `C:\inetpub\wwwroot\assets-khcn`).
2. **Cấu hình IIS Website**:
   - Mở **IIS Manager**.
   - Nhấp chuột phải vào mục **Sites** -> chọn **Add Website...** (hoặc tạo một Application dưới một Site có sẵn).
   - Đặt tên cho site và trỏ **Physical path** trực tiếp đến thư mục chứa file đã giải nén (nơi chứa file `app.js` đã đóng gói, file `web.config`, và thư mục con `node_modules`).
   - Chọn cổng (Port) và thiết lập Hostname nếu cần, sau đó nhấn **OK**.
3. **Phân quyền ghi thư mục (Rất quan trọng)**:
   - Ứng dụng khi chạy sẽ tự động tạo các thư mục lưu trữ: `uploads`, `avatars`, `certificates` ở cùng cấp với file chạy `app.js`.
   - Bạn cần cấp quyền ghi (**Write**) cho tài khoản chạy Application Pool (thường là `IIS_IUSRS` hoặc `NetworkService`) trên thư mục triển khai đó để tránh lỗi `Permission Denied` khi upload file.
     - _Cách làm: Chuột phải vào thư mục ứng dụng -> Properties -> Security -> Edit -> Chọn `IIS_IUSRS` -> Tích chọn `Write` -> Apply._

---

## Cấu trúc thư mục đóng gói (`dist-package`)

Sau khi đóng gói, cấu trúc thư mục tối giản triển khai lên server sẽ trông như sau:

```text
dist-package/
├── app.js               # Mã nguồn ứng dụng đã được bundle (Express, CORS, Multer...)
├── web.config           # File cấu hình IIS để chuyển tiếp yêu cầu đến iisnode
└── node_modules/
    └── canvas/          # Thư viện native vẽ ảnh (chứa file .node và các DLL cần thiết)
```

---

## Danh sách các Domain được phép gọi API (CORS)

Mặc định ứng dụng đã được cấu hình CORS chỉ cho phép các domain sau truy cập:

- `https://khcn.uef.edu.vn`
- `https://kekhaikhcn.uef.edu.vn`
- `https://uef-research.codex.io.vn`
- `https://uef-kekhai.codex.io.vn`
- `https://localhost:44370`
- `http://localhost:3147`

_(Bạn có thể chỉnh sửa danh sách này trực tiếp trong file `app.js` ở môi trường dev trước khi build lại)._