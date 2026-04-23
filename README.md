# 🐶 Dog Assistant Chat

## Project Description
Dog Assistant Chat is an AI-powered web application that helps users learn about dogs, dog training, and behavior through conversation.  
The user can ask questions, continue the same discussion, and switch between explanation mode and quiz mode.  

The application is designed to be friendly and easy to use, with a warm “dog assistant” personality and simple UI features such as quick question buttons and dynamic dog images.

---

## Architecture Overview
React frontend → FastAPI backend → Gemini API

- The frontend handles user interaction and stores conversation history
- The backend builds prompts and communicates with the LLM
- The LLM generates responses based on the conversation and selected mode

---

## Technical Choices
- **React**: Used for the frontend to manage UI state and chat interaction
- **FastAPI**: Used for the backend because it is lightweight and easy to build APIs with
- **Gemini API**: Used as the language model provider due to its simple integration and free tier
- **Conversation history**: Stored in React state and sent to the backend for context
- **Prompt engineering**: Used to control tone (friendly dog assistant) and behavior (explain vs quiz mode)
- **UI enhancements**: Added dog images and quick question buttons for better user experience

---

## Features
- 🐶 Chat with a dog assistant
- 🔁 Multi-turn conversation (remembers previous messages)
- 🎓 Two modes:
  - Explain mode (answers questions clearly)
  - Quiz mode (tests user knowledge)
- 🎲 Randomized quick question buttons
- 🖼️ Dynamic dog images in UI
- 💬 Friendly and natural response style



---

## Known Limitations
- Chat history is only stored in frontend memory (lost on refresh)
- No user authentication
- No database or persistent storage
- API rate limits (free tier) may temporarily block responses
- No streaming responses (full answer appears at once)
- Not optimized for production use

---

## AI Tools Used
- ChatGPT: used for code generation, debugging, and architecture guidance
- Gemini API: used for generating chatbot responses

---

## Complexity Level
**Level 2 – Stateful application**

This project includes:
- Multi-turn conversation with memory
- Application state handling in frontend
- Prompt mode switching (explain vs quiz)

It goes beyond a simple single request-response system but does not include external data sources or advanced pipelines.

---


## DEMO VIDEO ABOUT THE WORKING APPLICATION:
Click the image!

[![Watch the video](https://img.youtube.com/vi/loNE4eK1Mr4/0.jpg)](https://youtu.be/loNE4eK1Mr4)





