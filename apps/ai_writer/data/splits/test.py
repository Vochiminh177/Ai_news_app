import json
from sklearn.model_selection import train_test_split
import os

# Cấu hình đầu vào / đầu ra
input_file = "../data_for_training/data_training_v1.json"
train_file = "train.json"
val_file = "val.json"
val_ratio = 0.2  # 20% dùng làm validation

# Đọc dữ liệu đã chuẩn hóa
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📦 Tổng dữ liệu: {len(data)} mẫu")

# Chia train / val
train_data, val_data = train_test_split(data, test_size=val_ratio, random_state=42)

# Lưu dữ liệu đã chia
with open(train_file, "w", encoding="utf-8") as f:
    json.dump(train_data, f, ensure_ascii=False, indent=2)

with open(val_file, "w", encoding="utf-8") as f:
    json.dump(val_data, f, ensure_ascii=False, indent=2)

print(f"✅ Đã chia xong:")
print(f"   → Train: {len(train_data)} mẫu → {train_file}")
print(f"   → Val  : {len(val_data)} mẫu → {val_file}")
