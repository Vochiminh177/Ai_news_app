from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments, EarlyStoppingCallback
from datasets import Dataset
from sklearn.model_selection import train_test_split
import json
import os

# === Load & chia dữ liệu ===
with open("data_for_training.json", "r", encoding="utf-8") as f:
    full_data = json.load(f)

train_data, val_data = train_test_split(full_data, test_size=0.2, random_state=42)

# === Chuyển sang HuggingFace Dataset ===
train_dataset = Dataset.from_list(train_data)
val_dataset = Dataset.from_list(val_data)

# === Load model & tokenizer ===
model_name = "VietAI/vit5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# === Hàm tiền xử lý ===
def preprocess(example):
    model_input = tokenizer(example["input_text"], truncation=True, padding="max_length", max_length=128)
    label = tokenizer(example["target_text"], truncation=True, padding="max_length", max_length=512)
    model_input["labels"] = label["input_ids"]
    return model_input

train_dataset = train_dataset.map(preprocess, batched=True)
val_dataset = val_dataset.map(preprocess, batched=True)

# === Cấu hình huấn luyện ===
training_args = Seq2SeqTrainingArguments(
    output_dir="./vit5-news-output",
    eval_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=8,
    save_total_limit=1,
    predict_with_generate=True,
    logging_dir="./logs",
    logging_steps=10,
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,
)

# === Trainer + EarlyStopping ===
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
)

# === Huấn luyện ===
trainer.train()
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments, EarlyStoppingCallback
# from datasets import Dataset
# from sklearn.model_selection import train_test_split
# import json
#
# # Load data
# with open("data_for_training.json", "r", encoding="utf-8") as f:
#     full_data = json.load(f)
# train_data, val_data = train_test_split(full_data, test_size=0.2, random_state=42)
#
# # Convert to Dataset
# train_dataset = Dataset.from_list(train_data)
# val_dataset = Dataset.from_list(val_data)
#
# # Load model
# model_name = "VietAI/vit5-base"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
#
# # Preprocessing
# def preprocess(example):
#     model_input = tokenizer(example["input_text"], truncation=True, max_length=128)
#     label = tokenizer(example["target_text"], truncation=True, max_length=128)
#     model_input["labels"] = label["input_ids"]
#     return model_input
#
# train_dataset = train_dataset.map(preprocess, batched=True)
# val_dataset = val_dataset.map(preprocess, batched=True)
#
# # Training config
# training_args = Seq2SeqTrainingArguments(
#     output_dir="./vit5-news-output",
#     eval_strategy="epoch",
#     learning_rate=5e-5,
#     per_device_train_batch_size=2,
#     per_device_eval_batch_size=2,
#     num_train_epochs=8,
#     save_strategy="epoch",
#     save_total_limit=1,
#     predict_with_generate=True,
#     logging_dir="./logs",
#     logging_steps=10,
#     fp16=True,  # Enable if using GPU
# )
#
# # Trainer
# trainer = Seq2SeqTrainer(
#     model=model,
#     args=training_args,
#     train_dataset=train_dataset,
#     eval_dataset=val_dataset,
#     tokenizer=tokenizer,
#     callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
# )
#
# # Train
# trainer.train()
