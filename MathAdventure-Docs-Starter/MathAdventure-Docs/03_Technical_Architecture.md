# Kiến Trúc Kỹ Thuật

## Công nghệ đề xuất
- HTML, CSS, JavaScript cho phiên bản web
- Canvas hoặc DOM UI tùy mức độ tương tác
- JSON để lưu dữ liệu level, câu hỏi và cài đặt

## Các lớp chính
- Scene Layer: quản lý màn hình và luồng trò chơi
- System Layer: câu hỏi, điểm số, lưu tiến độ, âm thanh
- Data Layer: dữ liệu câu hỏi, avatar, level, phần thưởng
- UI Layer: giao diện và phản hồi người dùng

## Luồng xử lý
1. Khởi tạo trò chơi
2. Tải dữ liệu và tài nguyên
3. Sinh câu hỏi phù hợp với level
4. Cập nhật điểm số và trạng thái
5. Lưu tiến độ và điều hướng giữa các màn- Managers
- UI
- Math Engine
- Storage