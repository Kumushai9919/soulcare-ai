import { useState } from 'react';
import { generateTestResponse } from '../../utils/geminiProxy';

const questions = [
	{
		id: 1,
		question: 'How often do you feel overwhelmed by your responsibilities?',
		options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'],
	},
	{
		id: 2,
		question: 'How would you rate your sleep quality recently?',
		options: ['Excellent', 'Good', 'Fair', 'Poor'],
	},
	{
		id: 3,
		question: 'How often do you feel physically or emotionally exhausted?',
		options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'],
	},
	{
		id: 4,
		question: 'Do you find it difficult to concentrate on tasks?',
		options: ['Rarely', 'Sometimes', 'Often', 'Almost Always'],
	},
];

const StressTest = ({ onComplete }: { onComplete: (score: number, analysis: string) => void }) => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAnswer = async (score: number) => {
		const newAnswers = [...answers, score];
		if (currentQuestion < questions.length - 1) {
			setAnswers(newAnswers);
			setCurrentQuestion((prev) => prev + 1);
		} else {
			setIsAnalyzing(true);
			setError(null);
			try {
				const response = await generateTestResponse({
					answers: newAnswers,
					questions: questions,
				});

				const finalScore = calculateScore(newAnswers);
				onComplete(finalScore, response);
			} catch (error) {
				console.error('Analysis error:', error);
				setError('Failed to analyze results. Please try again.');
			} finally {
				setIsAnalyzing(false);
			}
		}
	};

	const calculateScore = (answers: number[]): number => {
		return (answers.reduce((a, b) => a + b, 0) / (questions.length * 3)) * 100;
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
				<h2 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
					Stress Assessment
				</h2>
				
				<div className="mb-8">
					<p className="text-xl mb-6 text-gray-700 font-medium">
						{questions[currentQuestion].question}
					</p>
					<div className="space-y-4">
						{questions[currentQuestion].options.map((option, index) => (
							<button
								key={index}
								onClick={() => handleAnswer(index)}
								className="w-full text-left p-4 rounded-xl transition-all duration-200 
									bg-gradient-to-r from-gray-50 to-white
									hover:from-purple-50 hover:to-pink-50
									text-gray-700 hover:text-gray-900
									shadow-sm hover:shadow-md
									relative overflow-hidden group
									border-2 border-transparent
									[background-clip:padding-box,border-box] 
									[background-origin:padding-box,border-box] 
									bg-[linear-gradient(white,white),linear-gradient(110deg,#4338ca,#c026d3,#e11d48)]
									hover:bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)),linear-gradient(110deg,#4338ca,#c026d3,#e11d48)]"
							>
								<span className="relative z-10">{option}</span>
								<div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-pink-600/10 
									opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
							</button>
						))}
					</div>
				</div>

				{/* Progress Indicator */}
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-500">
						Question {currentQuestion + 1} of {questions.length}
					</div>
					<div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
						<div 
							className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
							style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Loading State */}
				{isAnalyzing && (
					<div className="text-center mt-6">
						<div className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r 
							from-purple-500/10 to-pink-500/10">
							<p className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 
								bg-clip-text font-medium">
								Analyzing your responses...
							</p>
						</div>
					</div>
				)}

				{error && (
					<div className="text-red-500 text-center mt-6 bg-red-50 p-3 rounded-lg">
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

export default StressTest;
