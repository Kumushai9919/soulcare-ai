import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { generateChatResponse, generateTopicResponse } from "../../utils/geminiProxy";
import { saveChat, getAllChats, createNewChat } from "../../utils/chatStorage";
import type { Message, Conversation } from "../../type/chat";

interface Props {
  onBack: () => void;
}

const ChatInterface = ({}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const topic = location.state?.topic;

  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<Conversation>(createNewChat());
  const [conversations, setConversations] = useState<Conversation[]>(() => getAllChats());

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI therapist. How are you feeling today? I'm here to listen and support you.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");

  useEffect(() => {
    const initializeTopicChat = async () => {
      if (topic) {
        setIsLoading(true);
        try {
          const response = await generateTopicResponse(topic);
          setMessages([{
            role: "assistant",
            content: response,
            timestamp: new Date(),
          }]);
        } catch (error) {
          console.error("Topic initialization error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeTopicChat();
  }, [topic]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextPrompt = `You are an empathetic and professional therapist. 
        Previous conversation context: ${messages
          .slice(-3)
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n")}
        User's message: ${input}
        Provide a therapeutic, supportive response that shows understanding and offers guidance:`;

      const aiResponse = await generateChatResponse(contextPrompt);

      const botMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      // Save chat after each message
      saveChat(currentChat, [...messages, userMessage, botMessage]);
      // Update conversations list
      setConversations(getAllChats());
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble responding. Could we try again?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = (conv: Conversation) => {
    const savedChat = getAllChats().find((c) => c.id === conv.id);
    if (savedChat) {
      setCurrentChat(savedChat);
      setMessages(savedChat.messages);
    }
  };

  const handleNewChat = () => {
    const newChat = createNewChat();
    setCurrentChat(newChat);
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI therapist. How are you feeling today? I'm here to listen and support you.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] pt-6">  
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 fixed top-6 bottom-0">  
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Mindful AI</h1>
        </div>
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full mb-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            New Chat
          </button>
          <h2 className="text-sm font-semibold text-gray-400 mb-4">
            Chat History
          </h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleChatSelect(conv)}
                className={`p-3 hover:bg-gray-800 rounded-lg cursor-pointer ${
                  currentChat.id === conv.id ? "bg-gray-800" : ""
                }`}
              >
                <p className="text-white text-sm">{conv.title}</p>
                <p className="text-gray-400 text-xs">{conv.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ml-80">  
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <span>←</span> Back
            </button>
            <h2 className="text-xl font-bold text-white">
              Your AI Companion for Mental Wellness
            </h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-center text-sm text-gray-500">
            Your conversations are private and secure.
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-600 mr-3 flex-shrink-0" />
              <div className="max-w-[70%] rounded-2xl p-4 bg-[#1E1E1E] text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-80 right-0 p-4 border-t border-gray-800 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-[#1E1E1E] text-white rounded-xl px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-lg ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-700"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
