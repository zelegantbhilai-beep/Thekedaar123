import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, RefreshCcw } from 'lucide-react';
import { Chat } from '@google/genai';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const STORAGE_KEY = 'thekedaar_chat_history';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize messages from localStorage or use default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse chat history", e);
    }
    return [{ id: 'init', role: 'model', text: 'Hello! 👋 I can help you find the right professional for your needs. What seems to be the problem?' }];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession();
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleResetChat = () => {
    const initialMsg: ChatMessage = { 
      id: 'init', 
      role: 'model', 
      text: 'Hello! 👋 I can help you find the right professional for your needs. What seems to be the problem?' 
    };
    setMessages([initialMsg]);
    localStorage.removeItem(STORAGE_KEY);
    // Reset the session
    try {
      chatSessionRef.current = createChatSession();
    } catch (e) {
      console.error("Failed to reset chat session", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Ensure session exists
    if (!chatSessionRef.current) {
       chatSessionRef.current = createChatSession();
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseStream = await sendMessageStream(chatSessionRef.current, userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => msg.id === botMsgId ? { ...msg, text: fullText } : msg)
          );
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!process.env.API_KEY) return null; // Hide if no key

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 flex items-center gap-2 group"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Thekedaar Assistant</h3>
                <p className="text-xs opacity-80">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleResetChat} 
                title="Start New Chat"
                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close"
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-3 no-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 shadow-sm rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for help..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white dark:placeholder-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};