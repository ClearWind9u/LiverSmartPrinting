# LiverSmartPrinting

**LiverSmartPrinting** là một ứng dụng quản lý máy in và lịch sử in cho hệ thống in ấn. Ứng dụng bao gồm hai phần chính: **Server (Backend)** và **Client (Frontend)**. Dưới đây là hướng dẫn chi tiết để cài đặt và chạy dự án.

## Yêu cầu hệ thống
- Node.js (>= 14.0.0)
- MongoDB (Cài đặt hoặc sử dụng MongoDB Atlas)

## Cài đặt và cấu hình

### 1. Cài đặt Server

1. Truy cập vào thư mục **server**:

    ```bash
    cd server
    ```

2. Cài đặt các phụ thuộc:

    ```bash
    npm install
    ```

3. Chạy server (Backend):

    ```bash
    npm run server
    ```

    Lệnh này sẽ khởi động server và kết nối tới database MongoDB. Server sẽ lắng nghe trên cổng mặc định là `5000`.

### 2. Cài đặt Client

1. Truy cập vào thư mục **client**:

    ```bash
    cd client
    ```

2. Cài đặt các phụ thuộc:

    ```bash
    npm install
    ```

3. Chạy frontend (Client):

    ```bash
    npm run dev
    ```

    Lệnh này sẽ khởi động frontend và ứng dụng sẽ chạy trên cổng `3000` (mặc định).

### 3. Đăng nhập vào ứng dụng

- **Tài khoản người dùng**:  
  **Email**: `student@gmail.com`  
  **Mật khẩu**: `student`

- **Tài khoản quản trị viên (Admin)**:  
  **Email**: `admin@gmail.com`  
  **Mật khẩu**: `admin`

### 4. Cấu hình database

Để truy cập vào database MongoDB, bạn cần phải tạo một file `.env` trong thư mục **server** với nội dung kết nối tới MongoDB Atlas hoặc MongoDB cục bộ.

**File `.env` ví dụ**:

```env
MONGO_URL="mongodb+srv://phamthanhphong9u:12345@smart-printer.6q96r.mongodb.net/ssps?retryWrites=true&w=majority"

## Các lệnh hữu ích

- **Chạy Server (Backend)**:
    ```bash
    npm run server
    ```

- **Chạy Client (Frontend)**:
    ```bash
    npm run dev
    ```

## Cảm ơn bạn đã sử dụng LiverSmartPrinting!

Nếu bạn gặp bất kỳ sự cố nào trong quá trình cài đặt hoặc sử dụng, vui lòng mở issue trên GitHub hoặc liên hệ với đội ngũ phát triển.
