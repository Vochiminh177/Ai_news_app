from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import re
from fastapi import WebSocketDisconnect


# Load model
model = AutoModelForSeq2SeqLM.from_pretrained("models/checkpoints/checkpoint_9738")
tokenizer = AutoTokenizer.from_pretrained("VietAI/vit5-base")

# FastAPI app for testing
app = FastAPI()

# Output format
def format_output(text: str, title: str = "") -> str:
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"(\.)(\S)", r"\1 \2", text)

    sentences = re.split(r'(?<=[.!?]) +', text)
    paragraphs, paragraph = [], []

    for i, sentence in enumerate(sentences):
        paragraph.append(sentence)
        if len(paragraph) >= 3 or i == len(sentences) - 1:
            paragraphs.append(" ".join(paragraph))
            paragraph = []

    formatted_title = f" {title.strip().capitalize()}\n\n" if title else ""
    return formatted_title + "\n\n".join(paragraphs)

# Input schema
class GenerateRequest(BaseModel):
    prompt: str
    max_length: int = 500


@app.post("/generate")
def generate_article(request: GenerateRequest):
    input_ids = tokenizer(request.prompt, return_tensors="pt").input_ids
    with torch.no_grad():
        output = model.generate(
            input_ids,
            max_new_tokens=500,
            do_sample=True,
            temperature=0.8,
            top_k=40,
            top_p=0.9,
            no_repeat_ngram_size=2,
            repetition_penalty=1.2,
            early_stopping=True,
            eos_token_id=tokenizer.eos_token_id
        )

    result = tokenizer.decode(output[0], skip_special_tokens=True)
    return {"title": request.prompt, "content": format_output(result,title=request.prompt)}
    # return format_output(result,title=request.prompt)
@app.websocket("/ws")
async def websocket_generate(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            prompt = await websocket.receive_text()
            input_ids = tokenizer(prompt, return_tensors="pt").input_ids
            with torch.no_grad():
                output = model.generate(
                    input_ids,
                    max_new_tokens=700,
                    do_sample=True,
                    temperature=0.8,
                    top_k=40,
                    top_p=0.9,
                    no_repeat_ngram_size=4,
                    repetition_penalty=1.2,
                    early_stopping=True,
                    eos_token_id=tokenizer.eos_token_id
                )

            result = tokenizer.decode(output[0], skip_special_tokens=True)
            # formatted = format_output(result, title=prompt)
            await websocket.send_text({"title": prompt, "content": format_output(result, title=prompt)})
    except WebSocketDisconnect:
        print(" WebSocket client disconnected.")
    except Exception as e:
        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(f"[Error] {str(e)}")
