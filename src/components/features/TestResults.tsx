 
const TestResults = ({ score, onStartChat }: { score: number, onStartChat: () => void }) => {
  const getStressLevel = (score: number) => {
    if (score <= 25) return { level: "Low", color: "text-green-400" };
    if (score <= 50) return { level: "Moderate", color: "text-yellow-400" };
    if (score <= 75) return { level: "High", color: "text-orange-400" };
    return { level: "Severe", color: "text-red-400" };
  };

  const getSuggestions = (score: number) => {
    if (score <= 25) return [
      "Would you like to discuss preventive strategies?",
      "Let's talk about maintaining your current well-being",
      "How can we help you stay balanced?"
    ];
    if (score <= 50) return [
      "Would you like to explore stress management techniques?",
      "Let's discuss what's causing your stress",
      "How can we help you feel more balanced?"
    ];
    return [
      "Would you like to talk about immediate coping strategies?",
      "Let's discuss professional support options",
      "How can we help you feel better right now?"
    ];
  };

  const { level, color } = getStressLevel(score);
  const suggestions = getSuggestions(score);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Your Results</h2>
        <div className="mb-8">
          <p className="text-lg">Your stress level is: 
            <span className={`font-bold ${color}`}> {level}</span>
          </p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
            <div 
              className="bg-purple-600 h-4 rounded-full"
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Suggested Topics for Discussion</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {/* Navigate to chat with this topic */}}
                className="w-full text-left p-4 rounded bg-gray-700 hover:bg-purple-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={onStartChat}
            className="button-primary text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700"
          >
            Chat with AI Therapist
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
