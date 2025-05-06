from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Load model
model = AutoModelForSeq2SeqLM.from_pretrained("models/checkpoints/checkpoint_9738")
tokenizer = AutoTokenizer.from_pretrained("VietAI/vit5-base")

# FastAPI app
app = FastAPI()

# Input schema
class GenerateRequest(BaseModel):
    prompt: str
    max_length: int = 512

# API route
@app.post("/generate")
def generate_text(request: GenerateRequest):
    input_ids = tokenizer(request.prompt, return_tensors="pt").input_ids
    output = model.generate(
        input_ids,
        max_new_tokens=request.max_length,
        do_sample=True,
        temperature=0.8,
        top_k=50,
        top_p=0.95,
        no_repeat_ngram_size=4,
        repetition_penalty=1.2,
        early_stopping=True
    )
    text = tokenizer.decode(output[0], skip_special_tokens=True)
    return {"output": text}
