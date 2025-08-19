import  { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: number;
  title: string;
  preview: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  onBack: () => void;
}

const ChatInterface = ({   }: Props) => {
  const navigate = useNavigate();
  // Test conversations and messages
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "Conversation 1: Stress Management",
      preview: "Managing daily stress...",
    },
    {
      id: 2,
      title: "Conversation 2: Anxiety Relief",
      preview: "Techniques for anxiety...",
    },
    {
      id: 3,
      title: "Conversation 3: Work-Life Bal...",
      preview: "Finding balance...",
    },
    {
      id: 4,
      title: "Conversation 4: Personal Gro...",
      preview: "Growth journey...",
    },
  ]);
  

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello there! I'm here to support you. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        role: "assistant",
        content:
          "I understand. It's common to feel overwhelmed when balancing work and personal life. Let's explore some strategies to manage your stress. Would you like to start with some relaxation techniques or discuss time management?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className="w-80 bg-[#111111] border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Mindful AI</h1>
        </div>
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">
            Chat History
          </h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3 hover:bg-gray-800 rounded-lg cursor-pointer flex items-center"
              >
                <div>
                  <p className="text-white text-sm">{conv.title}</p>
                </div>
                <span className="ml-2">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <span>←</span> Back
            </button>
            <h2 className="text-xl font-bold text-white">
              Your AI Companion for Mental Wellness
            </h2>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white">
              Home
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              About
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
            <button className="bg-purple-600 text-white px-4 py-1 rounded-md">
              Get Started
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-center text-sm text-gray-500">
            Mindful AI offers personalized support and guidance to help you
            navigate life&apos;s challenges and achieve emotional well-being.
          </p>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-600 mr-3 flex-shrink-0" />
              )}
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-[#1E1E1E] text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-[#1E1E1E] text-white rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-8">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Contact Us
            </a>
          </div>
          <p className="mt-2">©2024 Mindful AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
