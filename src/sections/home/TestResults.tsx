import { useNavigate } from 'react-router-dom';

interface TestResultsProps {
  score: number;
  analysis: string;
  onStartChat?: () => void;
}

const TestResults = ({ score, analysis, onStartChat }: TestResultsProps) => {
  const navigate = useNavigate();

  const getStressLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-500', gradient: 'from-green-500 to-teal-500' };
    if (score < 60) return { level: 'Moderate', color: 'text-yellow-500', gradient: 'from-yellow-500 to-orange-500' };
    return { level: 'High', color: 'text-red-500', gradient: 'from-red-500 to-pink-500' };
  };

  const getSuggestions = (score: number) => {
    const allSuggestions = {
      low: [
        'Maintaining Mental Wellness',
        'Preventive Self-Care',
        'Personal Growth'
      ],
      moderate: [
        'Stress Management Techniques',
        'Work-Life Balance',
        'Sleep Quality Improvement'
      ],
      high: [
        'Anxiety Management',
        'Stress Relief Techniques',
        'Mindfulness Practices'
      ]
    };

    if (score < 30) return allSuggestions.low;
    if (score < 60) return allSuggestions.moderate;
    return allSuggestions.high;
  };

  const { level, color, gradient } = getStressLevel(score);
  const suggestions = getSuggestions(score);

  return (
    <div className="max-w-7xl mx-auto p-6 mb-36 font-mono">
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Your Stress Assessment Results
        </h2>
        
        {/* Stress Level Indicator */}
        <div className="mb-8">
          <p className="text-xl text-gray-700">
            Your stress level is: 
            <span className={`font-bold ml-2 ${color}`}>{level}</span>
          </p>
          <div className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* AI Analysis - More Compact */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Summary</h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="prose prose-gray max-w-none">
              {analysis.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 mb-4 last:mb-0">
                  {paragraph.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions with Matching Style */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Topics</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => navigate('/chat', { state: { topic: suggestion }})}
                className="w-full text-left p-4 rounded-xl transition-all duration-300
                  relative overflow-hidden group
                  border-2 border-transparent
                  [background-clip:padding-box,border-box] 
                  [background-origin:padding-box,border-box] 
                  bg-[linear-gradient(white,white),linear-gradient(110deg,rgba(67,56,202,0.2),rgba(192,38,211,0.2),rgba(225,29,72,0.2))]
                  hover:bg-[linear-gradient(rgba(67,56,202,0.05),rgba(192,38,211,0.05)),linear-gradient(110deg,rgba(67,56,202,0.8),rgba(192,38,211,0.8),rgba(225,29,72,0.8))]
                  text-gray-700 hover:text-white
                  shadow-sm hover:shadow-md"
              >
                <span className="relative z-10 transition-colors duration-300">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Button */}
        <div className="text-center">
          <button
            onClick={onStartChat}
            className="px-8 py-4 rounded-xl font-medium text-white
              bg-gradient-to-r from-purple-600 to-pink-500 
              hover:from-purple-700 hover:to-pink-600
              transform transition-all duration-200
              hover:shadow-lg hover:scale-[1.02]"
          >
            Chat with AI Therapist
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
