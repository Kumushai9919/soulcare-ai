const MAX_DAILY_REQUESTS = 10;

const checkDailyLimit = (): boolean => {
  const today = new Date().toDateString();
  const usageData = JSON.parse(localStorage.getItem('apiUsage') || '{}');
  
  if (usageData.date !== today) {
    usageData.date = today;
    usageData.count = 0;
  }
  
  if (usageData.count >= MAX_DAILY_REQUESTS) {
    return false;
  }
  
  usageData.count++;
  localStorage.setItem('apiUsage', JSON.stringify(usageData));
  return true;
};

export const generateChatResponse = async (prompt: string): Promise<string> => {
  if (!checkDailyLimit()) {
    return "You've reached your daily limit. Please try again tomorrow!";
  }

  try { 
    const res = await fetch(`${import.meta.env.VITE_GEMINI_PROXY_URL}/api/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.text || "No response from Gemini.";
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "😪 AI is sleeping. Try again later!";
  }
};



export const generateTestResponse = async (data: { questions: any[]; answers: number[] }): Promise<string> => {
  if (!checkDailyLimit()) {
    return "You've reached your daily limit. Please try again tomorrow!";
  }

  try { 
    const res = await fetch(`${import.meta.env.VITE_GEMINI_PROXY_URL}/api/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result.analysis || "No analysis available.";
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "😪 AI is sleeping. Try again later!";
  }
};


export const generateTopicResponse = async (topic: string): Promise<string> => {
  if (!checkDailyLimit()) {
    return "You've reached your daily limit. Please try again tomorrow!";
  }

  const topicPrompt = `As an AI therapist, provide an opening message about ${topic}. 
    Offer a supportive introduction and ask 1-2 questions to start the conversation about this topic.`;

  try {
    const res = await fetch(`${import.meta.env.VITE_GEMINI_PROXY_URL}/api/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: topicPrompt }),
    });

    const data = await res.json();
    return data.text || "Let's discuss about " + topic;
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "I'd be happy to discuss " + topic + " with you. How would you like to start?";
  }
};

export const getRemainingRequests = (): number => {
  const today = new Date().toDateString();
  const usageData = JSON.parse(localStorage.getItem('apiUsage') || '{}');
  
  if (usageData.date !== today) {
    return MAX_DAILY_REQUESTS;
  }
  
  return MAX_DAILY_REQUESTS - (usageData.count || 0);
};

