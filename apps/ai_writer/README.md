
# Huấn luyện mô hình cho module phát sinh bài viết tiếng Việt (ViT5)
---

## Cấu trúc thư mục `ai_writer/`

```
ai_writer/
├── data/                # Chứa dữ liệu
│   ├── raw/             # Dữ liệu gốc thu thập từ báo
│   ├── standard/        # Dữ liệu đã làm sạch và chuẩn hóa
│   └── splits/          # Dữ liệu được chia ra val và train
│
├── models/              # Lưu checkpoint mô hình sau khi huấn luyện
│   └── checkpoint_9738/
│
├── notebooks/           # Ghi chú, thử nghiệm nhanh bằng Jupyter (để trống hoặc sẽ cập nhật sau)
│
├── src/                 # Chứa toàn bộ mã nguồn xử lý(một số hàm quan trọng)
│   ├── vnexpress_crawler.py # file dành riêng để cào bài viết từ vnexpress
│   ├── train_vit5.py    # Script huấn luyện chính
│   ├── vit5_model.py    # Hàm load model/tokenizer
│   └── clear_and_prepare_dataset.py  # Hàm định dạng output mô hình 
│
└── tests/               # Thư mục kiểm thử API sinh văn bản
    └── test_generate_api.py
```

---

## Mục tiêu

- Fine-tune mô hình `VietAI/vit5-base` để sinh bài viết hoàn chỉnh bằng tiếng Việt
- Input: tiêu đề hoặc một đoạn ngắn bài viết
- Output: nội dung bài viết được sinh tự động

---

## Chuẩn bị dữ liệu

1. **Thu thập dữ liệu** từ các nguồn báo → lưu trong `data/raw/`
2. **Làm sạch và chuẩn hóa** → `data/standard/data_training_v1.json`
3. **Chia train/val**:
   - `data/splits/train.json` (~80%)
   - `data/splits/val.json` (~20%)

---

## Huấn luyện mô hình

Chạy script sau để bắt đầu huấn luyện:

```bash
python src/training/train_vit5.py
```

Kết quả checkpoint sẽ được lưu trong `models/checkpoint_xxxx/`.
Phần này dùng mình dùng gg Colab để chạy trên máy ảo đề cho công suất nhanh và tốt nhất
vì cần dung lượng RAM lớn!

---

## Thiết lập thông số và kiểm thử đầu ra mô hình

Sau khi huấn luyện, sẽ kiểu tra epoch nào có val loss thấp nhất thì là trạng thái mô hình
thể hiện tốt nhất (checkpoint_9738). 
Thiết lập các thông số về số token phát sinh (700), độ sáng tạo và dừng phát sinh khi các ý đầy đủ
Đóng gói mô hình thành FastAPI để kiểm thử

```terminal
cd ./.../.../api
uvicorn main:app --reload

```

---

## Định dạng đầu ra

- Làm sạch lỗi ngôn ngữ
- Thêm tiêu đề rõ ràng

---


