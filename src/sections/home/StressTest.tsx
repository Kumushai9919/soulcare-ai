import { useState } from "react";
import { generateTestResponse } from "../../utils/geminiProxy";

const questions = [
	{
		id: 1,
		question: "How often do you feel overwhelmed by your responsibilities?",
		options: ["Rarely", "Sometimes", "Often", "Almost Always"],
	},
	{
		id: 2,
		question: "How would you rate your sleep quality recently?",
		options: ["Excellent", "Good", "Fair", "Poor"],
	},
	{
		id: 3,
		question: "How often do you feel physically or emotionally exhausted?",
		options: ["Rarely", "Sometimes", "Often", "Almost Always"],
	},
	{
		id: 4,
		question: "Do you find it difficult to concentrate on tasks?",
		options: ["Rarely", "Sometimes", "Often", "Almost Always"],
	},
];

const StressTest = ({
	onComplete,
}: {
	onComplete: (score: number, analysis: string) => void;
}) => {
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
				console.error("Analysis error:", error);
				setError("Failed to analyze results. Please try again.");
			} finally {
				setIsAnalyzing(false);
			}
		}
	};

	const calculateScore = (answers: number[]): number => {
		return (answers.reduce((a, b) => a + b, 0) / (questions.length * 3)) * 100;
	};

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6 font-mono mb-72">
			<div className="bg-white rounded-2xl p-6 sm:p-12 shadow-xl border border-gray-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
					Stress Assessment
				</h2>

				{/* Introduction Text */}
				<p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10">
					This quick assessment helps us understand your needs so we can provide
					the best support. Your responses will help us tailor our guidance to
					what matters most to you.
				</p>

				<div className="mb-8 sm:mb-10">
					<p className="text-base sm:text-lg mb-6 sm:mb-10 text-gray-700 font-medium">
						{questions[currentQuestion].question}
					</p>
					<div className="space-y-6">
						{questions[currentQuestion].options.map((option, index) => (
							<button
								key={index}
								onClick={() => handleAnswer(index)}
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
								<span className="relative z-10 transition-colors duration-300 text-sm sm:text-base">
									{option}
								</span>
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
							style={{
								width: `${((currentQuestion + 1) / questions.length) * 100}%`,
							}}
						/>
					</div>
				</div>

				{/* Loading State */}
				{isAnalyzing && (
					<div className="text-center mt-6">
						<div
							className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r 
							from-purple-500/10 to-pink-500/10"
						>
							<p
								className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 
								bg-clip-text font-medium"
							>
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
