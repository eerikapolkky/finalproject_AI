import os
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing. Add it to your .env file.")

genai.configure(api_key=api_key)

app = FastAPI(title="Dog Assistant Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryMessage]
    mode: Literal["explain", "quiz"] = "explain"


class ChatResponse(BaseModel):
    reply: str


def build_system_prompt(mode: str) -> str:
    if mode == "quiz":
        return (
            "You are a warm, friendly dog assistant. "
            "Quiz the user about dog care, dog behavior, and dog training. "
            "Ask one question at a time. "
            "Be kind, natural, and encouraging. "
            "Only write the final answer for the user. "
            "Do not include instructions, planning, reasoning, notes, or formatting rules. "
            "Do not use bullet points unless the user asks for them."
        )

    return (
        "You are a warm, caring, friendly dog assistant. "
        "Answer questions about dogs, dog care, dog behavior, and dog training. "
        "Write in short, natural paragraphs. "
        "Sound like a kind dog lover giving practical advice. "
        "Only write the final answer for the user. "
        "Do not include instructions, planning, reasoning, notes, or formatting rules. "
        "Do not use bullet points unless the user asks for them."
    )


def build_prompt(history: List[HistoryMessage], latest_message: str, mode: str) -> str:
    system_prompt = build_system_prompt(mode)

    previous_user_messages = ""
    for msg in history:
        if msg.role == "user":
            previous_user_messages += f"user: {msg.content}\n"

    return (
        f"{system_prompt}\n\n"
        f"Previous user messages:\n{previous_user_messages}\n"
        f"user: {latest_message}\n"
        "assistant:"
    )


@app.get("/")
def root():
    return {"message": "Dog Assistant Chat backend is running."}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    prompt = build_prompt(request.history, request.message, request.mode)

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = response.text if hasattr(response, "text") else "No response received."
        return ChatResponse(reply=text)

    except Exception as e:
        error_text = str(e)

        if "429" in error_text:
            return ChatResponse(
                reply="🐶 I’ve been helping a lot of people today, so I need a short break! But here’s a quick tip: puppies learn best with short, positive training sessions and lots of praise."
            )

        if "404" in error_text:
            return ChatResponse(
                reply="🐶 Hmm, something went wrong with my brain setup. But I can still help! Dogs learn best with consistency and rewards."
            )

        return ChatResponse(reply=f"Backend error: {error_text}")