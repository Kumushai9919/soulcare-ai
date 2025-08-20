 
import type { Conversation } from '../type/chat';
import type { Message } from '../type/chat';

// Unique key for storing chats in localStorage 
const CHAT_STORAGE_KEY = 'soul_care_chats'; 

export const saveChat = (conversation: Conversation, messages: Message[]) => {
  const chats = getAllChats();
  const chatToSave = {
    ...conversation,
    messages,
    lastUpdated: new Date().toISOString(),
    preview: messages[messages.length - 1]?.content.slice(0, 50) + '...'
  };
  
  const existingIndex = chats.findIndex(c => c.id === conversation.id);
  if (existingIndex >= 0) {
    chats[existingIndex] = chatToSave;
  } else {
    chats.push(chatToSave);
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
};

// Get all chats from localStorage
// Returns empty array if no chats found
export const getAllChats = (): (Conversation & { messages: Message[] })[] => {
  try {
    const chats = localStorage.getItem(CHAT_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error reading chats from storage:', error);
    return [];
  }
};

// Get a single chat by ID
export const getChat = (id: number) => {
  return getAllChats().find(chat => chat.id === id);
};

// Create a new chat with unique ID
export const createNewChat = (): Conversation => {
  const chats = getAllChats();
  const newId = chats.length > 0 ? Math.max(...chats.map(c => c.id)) + 1 : 1;
  return {
    id: newId,
    title: `Chat ${newId}`,
    preview: 'New conversation...'
  };
};

// Optional: Add a function to delete chats
export const deleteChat = (id: number): void => {
  const chats = getAllChats().filter(chat => chat.id !== id);
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
};

// Optional: Add a function to clear all chats
export const clearAllChats = (): void => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
};
