"use client";

import OpenAI from "openai";
import { Button, Container, Input } from "reactstrap";
import React, { useEffect, useRef, useState } from "react";

import "../styles/chatbox.css";
import Message from "./Message";
import getWeather from "../api/getWeather";

const testMessages = [
  {
    sender: "Bot",
    message:
      "Hello, there. I'm KisaanGPT. I can help you with questions regarding farming and agriculture. Ask me anything.",
  },
];

const ChatBox = () => {
  const ref = useRef(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([...testMessages]);
  const [openai, setOpenai] = useState(null);
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);

  useEffect(() => {
    initializeOpenAI();
  }, []);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const initializeOpenAI = async () => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const assistant = await openai.beta.assistants.retrieve(
      process.env.NEXT_PUBLIC_ASSISTANT_ID
    );

    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const handleSubmit = () => {
    if (question) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: question },
      ]);
      setQuestion("");

      askBot();
    }
  };

  const askOpenAI = async () => {
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    var response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status == "in_progress" || response.status == "queued") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const message = await openai.beta.threads.messages.list(thread.id);

    return String(message.data[0].content[0].text.value).replace(/\*/g, "");
  };

  const askBot = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "Bot", message: "Wondering..." },
    ]);

    // const reply = await getWeather(question);

    const reply = await askOpenAI(question);

    setMessages((prevMessages) => {
      const lastMessages = [...prevMessages];
      const lastMessage = lastMessages[lastMessages.length - 1];
      lastMessage.message = reply;
      return lastMessages;
    });
  };

  return (
    <Container className="chatbox-container">
      <div className="messages-container">
        {messages.map((m, index) => (
          <Message key={index} sender={m.sender} message={m.message} />
        ))}
        <div ref={ref} />
      </div>

      <div className="input-container">
        <Input
          autoFocus
          className="question-input"
          value={question}
          type="text"
          placeholder="Ask a question..."
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <Button className="question-button" onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </Container>
  );
};

export default ChatBox;
