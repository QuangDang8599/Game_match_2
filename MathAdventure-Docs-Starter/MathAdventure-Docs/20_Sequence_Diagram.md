# Sơ Đồ Tuần Tự

```mermaid
sequenceDiagram
    participant Player
    participant GameManager
    participant QuestionSystem
    participant UIController

    Player->>GameManager: Bắt đầu chơi
    GameManager->>QuestionSystem: Tạo câu hỏi
    QuestionSystem-->>GameManager: Trả về câu hỏi
    GameManager->>UIController: Hiển thị câu hỏi
    Player->>UIController: Chọn đáp án
    UIController->>GameManager: Gửi kết quả
    GameManager-->>Player: Hiển thị phản hồi
```