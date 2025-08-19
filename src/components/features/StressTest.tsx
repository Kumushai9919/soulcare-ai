import   { useState } from 'react';

const questions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by your responsibilities?",
    options: ["Rarely", "Sometimes", "Often", "Almost Always"]
  },
  {
    id: 2,
    question: "How would you rate your sleep quality recently?",
    options: ["Excellent", "Good", "Fair", "Poor"]
  },
  {
    id: 3,
    question: "How often do you feel physically or emotionally exhausted?",
    options: ["Rarely", "Sometimes", "Often", "Almost Always"]
  },
  {
    id: 4,
    question: "Do you find it difficult to concentrate on tasks?",
    options: ["Rarely", "Sometimes", "Often", "Almost Always"]
  }
];

const StressTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    if (currentQuestion < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQuestion(prev => prev + 1);
    } else {
      const finalScore = calculateScore(newAnswers);
      onComplete(finalScore);
    }
  };

  const calculateScore = (answers: number[]): number => {
    return (answers.reduce((a, b) => a + b, 0) / (questions.length * 3)) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Stress Assessment</h2>
        <div className="mb-8">
          <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-3 rounded bg-gray-700 hover:bg-purple-600 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
};

export default StressTest;
