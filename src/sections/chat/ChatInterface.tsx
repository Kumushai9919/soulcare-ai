import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  generateChatResponse,
  generateTopicResponse,
  getRemainingRequests,
} from "../../utils/geminiProxy";
import { saveChat, getAllChats, createNewChat } from "../../utils/chatStorage";
import type { Message, Conversation } from "../../type/chat";
import { HiMenuAlt2, HiPaperAirplane, HiX } from "react-icons/hi";
import Toast from "../../components/features/Toast";

interface Props {
  onBack: () => void;
}

const ChatInterface = ({}: Props) => {
  const location = useLocation();
  const topic = location.state?.topic;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize sidebar state from navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    location.state?.sidebarOpen ?? true
  );

  // Reset scroll position on mount
  useEffect(() => {
    if (location.state?.fromHome) {
      window.scrollTo(0, 0);
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<Conversation>(createNewChat());
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getAllChats()
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI therapist. How are you feeling today? I'm here to listen and support you.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setShowToast(true);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle textarea auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  // Handle mobile focus - prevent zoom and scroll input into view
  const handleInputFocus = () => {
    // Prevent iOS zoom on input focus
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    setTimeout(() => {
      if (inputContainerRef.current) {
        inputContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }
    }, 100);
  };

  useEffect(() => {
    const initializeTopicChat = async () => {
      if (topic) {
        setIsLoading(true);
        try {
          const response = await generateTopicResponse(topic);
          setMessages([
            {
              role: "assistant",
              content: response,
              timestamp: new Date(),
            },
          ]);
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
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsLoading(true);

    try {
      const contextPrompt = `You are an empathetic and professional therapist. Previous conversation context: ${messages
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
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
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
    // Close sidebar on mobile after creating new chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Viewport meta fix for mobile */}
      <style>{`
        html {
          font-size: 16px !important;
         
        }
        input, textarea {
          font-size: 16px !important;

        }
        @media screen and (max-width: 768px) {
          .mobile-input {
            font-size: 16px !important;
            transform: none !important;
          }
        }
      `}</style>
      
      <Toast
        message={`You have ${getRemainingRequests()} daily AI chat requests remaining.`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="flex h-screen bg-[#0A0A0A] overflow-hidden" style={{ minHeight: '100vh', maxHeight: '100vh' }}>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`w-80 md:w-64 bg-[#0A0A0A] border-r border-gray-800 fixed md:relative top-0 bottom-0 transition-transform duration-300 z-50 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${isSidebarOpen ? "md:block" : "md:hidden"}`}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors md:hidden"
          >
            <HiX size={20} />
          </button>

          {/* Sidebar Content */}
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <Link to="/" className="flex flex-col items-start gap-2">
                <h1 className="font-mono text-lg md:text-xl font-bold text-white">
                  Soulcare
                </h1>
              </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <button
                onClick={handleNewChat}
                className="w-full font-mono mb-4 py-3 text-white rounded-lg bg-gradient-to-r from-[#B44BF2] to-[#7B68EE] hover:from-[#a043d9] hover:to-[#6f5dd4] transition-all duration-200 font-medium"
              >
                New Chat
              </button>
              
              <h2 className="text-sm font-semibold text-gray-400 mb-4 font-mono">
                Chat History
              </h2>
              
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleChatSelect(conv)}
                    className={`p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors  ${
                      currentChat.id === conv.id ? "bg-gray-800" : ""
                    }`}
                  >
                    <p className="text-sm text-white truncate">{conv.title}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Fixed Header */}
          <header className="flex justify-between items-center h-12 md:h-16 px-3 md:px-4 border-b border-gray-800 bg-[#0A0A0A] flex-shrink-0 relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <HiMenuAlt2 size={20} />
              </button>
              <h2 className="hidden sm:block text-sm md:text-lg font-mono text-white/90 truncate">
                Your AI Companion for Mental Wellness
              </h2>
            </div>
            
            <Link to="/" className="flex-shrink-0">
              <img
                src="/soul2.png"
                alt="Soulcare Logo"
                className="h-8 md:h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
          </header>

          {/* Messages Container - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-behavior-none">
            <div className="px-3 md:px-4 py-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <img
                      src="/soul2.png"
                      alt="AI Avatar"
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2 md:mr-3 flex-shrink-0 bg-purple-300 p-1 mt-1"
                    />
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-[#1E1E1E] text-white"
                    }`}
                  >
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <img
                    src="/soul2.png"
                    alt="AI Avatar"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2 md:mr-3 flex-shrink-0 bg-purple-300/30 p-1 mt-1"
                  />
                  <div className="max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 bg-[#1E1E1E] text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-.5s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Fixed Input Area */}
          <div 
            ref={inputContainerRef}
            className="border-t border-gray-800 bg-[#0A0A0A] flex-shrink-0 relative z-10"
          >
            <div className="p-2 sm:p-3 md:p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-full px-3 py-2 md:px-4 md:py-3">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={handleInputFocus}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full bg-transparent text-white focus:outline-none text-base md:text-base placeholder-gray-400 mobile-input"
                      style={{ fontSize: '16px' }}
                      disabled={isLoading}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                      input.trim() && !isLoading
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                    type="button"
                  >
                    <HiPaperAirplane
                      className="w-4 h-4 transform rotate-90"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
 
 