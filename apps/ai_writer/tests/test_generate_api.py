from fastapi.testclient import TestClient
from AI_news_web.apps.ai_writer.src.api.main import app

client = TestClient(app)

def test_generate_success():
    # Prompt để test
    payload = {
        "prompt": "Ứng dụng của trí tuệ nhân tạo trong giáo dục",
        "max_length": 300
    }

    # Gửi POST đến API /generate
    response = client.post("/generate", json=payload)

    # Kiểm tra mã phản hồi
    assert response.status_code == 200

    # In ra nội dung sinh ra
    print("\nOutput text:")
    print(response.text)
