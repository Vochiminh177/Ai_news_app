import json
import os

def clean_text(text):
    if not text:
        return ""
    return (
        text.strip()
        .replace("\xa0", " ")
        .replace("\u200b", "")
        .replace("\n", " ")
    )

def standardize_article(article):
    title = clean_text(article.get("title", ""))
    content = clean_text(article.get("content", ""))

    # Bỏ bài lỗi hoặc quá ngắn
    if not title or not content or len(content.split()) < 50:
        return None

    return {
        "input_text": title,
        "target_text": content
    }

def process_file(input_file, output_dir):
    with open(input_file, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    standardized = []
    for article in raw_data:
        item = standardize_article(article)
        if item:
            standardized.append(item)

    print(f"Tổng số bài hợp lệ: {len(standardized)}")

    os.makedirs(output_dir, exist_ok=True)

    # Lưu toàn bộ vào một file duy nhất
    output_path = os.path.join(output_dir, "data_for_training.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(standardized, f, ensure_ascii=False, indent=2)

    print(f"✔️ Dữ liệu đã được chuẩn hóa và lưu tại: {output_path}")

# Ví dụ dùng
if __name__ == "__main__":
    input_path = "vnexpress_thoi_su_20250422_124811.json"      # ← file từ crawler
    output_dir = "data_for_training.json"        # ← thư mục lưu output
    process_file(input_path, output_dir)
