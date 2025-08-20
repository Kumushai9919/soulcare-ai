import { useState, useRef } from 'react'; 
import Hero from './Hero';
import StressTest from '../../components/features/StressTest';
import TestResults from '../../components/features/TestResults';
import { useNavigate } from 'react-router-dom';

type FeaturesProps = {
  onStartChat: () => void;
};

export default function Features({ onStartChat }: FeaturesProps) {
  const [showTest, setShowTest] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const testSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleStartTest = () => {
    setShowTest(true);
    setTimeout(() => {
      testSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <Hero onStartChat={onStartChat} />

      {/* Stress Assessment Button */}
      <div className="text-center mt-8">
        <button onClick={handleStartTest} className="button-primary">
          Take Stress Assessment
        </button>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-24 mb-16">
        <h2 className="text-4xl font-bold mb-8">
          Ready to Begin Your Journey?
        </h2>
        <button
          onClick={() => { 
            navigate('/chat');
          }}
          className="button-primary"
        >
          Start Chatting
        </button>
      </div>

      {/* Stress Test Component */}
      <div ref={testSectionRef}>
        {showTest && testScore === null && (
          <StressTest
            onComplete={(score, analysisResult) => {
              setTestScore(score);
              setAnalysis(analysisResult);
              setShowTest(false);
            }}
          />
        )}
      </div>

      {/* Test Results Component */}
      {testScore !== null && (
        <TestResults
          score={testScore}
          analysis={analysis}
          onStartChat={onStartChat}
        />
      )}
    </div>
  );
}