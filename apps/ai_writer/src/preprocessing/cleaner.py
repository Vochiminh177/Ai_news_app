import json
import os
from glob import glob

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

    if not title or not content or len(content.split()) < 50:
        return None

    return {
        "input_text": title,
        "target_text": content
    }

def process_all_json_files(input_folder, output_file):
    all_articles = []
    file_list = glob(os.path.join(input_folder, "*.json"))

    print(f"Tìm thấy {len(file_list)} file JSON trong thư mục '{input_folder}'")

    for file_path in file_list:
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                for article in data:
                    item = standardize_article(article)
                    if item:
                        all_articles.append(item)
            except Exception as e:
                print(f"Lỗi khi xử lý file {file_path}: {e}")

    print(f"Tổng số bài hợp lệ: {len(all_articles)}")

    # Ghi ra file duy nhất
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, ensure_ascii=False, indent=2)

    print(f"Dữ liệu đã chuẩn hóa và lưu tại: {output_file}")

# Ví dụ dùng
if __name__ == "__main__":
    input_folder = "../../data/raw/vnexpress_raw_json_data"
    output_file = "../../data/data_for_training/data_training_v1.json"
    process_all_json_files(input_folder, output_file)
