# 🚀 UEF Science KHCN - Docker Setup

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────────┐
│                        khcn-network                             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  SQL Server │◄───│  QLKHCN API  │◄───│  KHCN Frontend   │   │
│  │  port 1433  │    │  port 27777  │    │   port 3000      │   │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────────────────────┐   │
│  │   Mailer API    │    │          Assets API              │   │
│  │   port 5174     │    │          port 5175               │   │
│  └─────────────────┘    └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Các Services

| Service         | Image / Tech        | Port  | Mô tả                            |
|----------------|---------------------|-------|----------------------------------|
| `sqlserver`    | SQL Server 2019     | 1433  | Database chính                   |
| `qlkhcn-api`   | ASP.NET Core 5.0    | 27777 | Backend REST API                 |
| `khcn-frontend`| React + Nginx       | 3000  | Website khcn.uef.edu.vn          |
| `mailer-api`   | Node.js / Express   | 5174  | Dịch vụ gửi email                |
| `assetskhcn-api`| Node.js / Express  | 5175  | Upload file, avatar, certificate |

## Hướng dẫn cài đặt

### 1. Chuẩn bị file môi trường

```bash
cp .env.example .env
```

Mở file `.env` và điền các giá trị thực tế, đặc biệt là:
- `MSSQL_SA_PASSWORD` — mật khẩu SQL Server (bắt buộc mạnh)
- `JWT_SECRET` — thay bằng chuỗi bí mật mạnh hơn khi deploy production

### 2. (Tuỳ chọn) Import database

Nếu bạn có file backup SQL, đặt vào `docker/sqlserver/init/` với tên bắt đầu bằng số để đảm bảo thứ tự thực thi, ví dụ: `02_import_data.sql`.

### 3. Khởi động toàn bộ hệ thống

```bash
# Build và chạy tất cả services
docker compose up -d --build

# Xem log theo dõi
docker compose logs -f

# Xem log của service cụ thể
docker compose logs -f qlkhcn-api
```

### 4. Kiểm tra trạng thái

```bash
docker compose ps
```

## Truy cập sau khi khởi động

| URL | Mô tả |
|-----|-------|
| http://localhost:3000 | KHCN Frontend |
| http://localhost:27777/swagger | API Swagger UI |
| http://localhost:5174 | Mailer API |
| http://localhost:5175 | Assets API |
| localhost:1433 | SQL Server (dùng SSMS hoặc Azure Data Studio) |

## Lệnh thường dùng

```bash
# Dừng tất cả services
docker compose down

# Dừng và xóa volumes (⚠️ xóa dữ liệu database!)
docker compose down -v

# Restart một service
docker compose restart qlkhcn-api

# Rebuild một service cụ thể
docker compose up -d --build khcn-frontend

# Xem log real-time
docker compose logs -f --tail=100
```

## Lưu ý quan trọng

> ⚠️ **SQL Server** cần khoảng 30-60 giây để khởi động hoàn toàn. API service sẽ tự động chờ nhờ `healthcheck`.

> ⚠️ **File .env** chứa thông tin nhạy cảm — đã được thêm vào `.gitignore`, KHÔNG commit lên Git.

> ℹ️ **assetskhcn-api** dùng Debian image (không phải Alpine) vì thư viện `canvas` cần các native libraries.
