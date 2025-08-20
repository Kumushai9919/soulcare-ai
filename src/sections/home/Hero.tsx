import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import StressTest from "./StressTest";
import TestResults from "./TestResults";
type FeaturesProps = {
  onStartChat: () => void;
};

export default function Hero({ onStartChat }: FeaturesProps) {
  const [showTest, setShowTest] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const testSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleStartTest = () => {
    setShowTest(true);
    setTimeout(() => {
      testSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9  },
    },
  };

  const testVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Initial Welcome */}
          <motion.div className="mb-16" variants={itemVariants}>
            <motion.img
              src="/soul2.png"
              alt="Soulcare Logo"
              className="h-96 mx-auto mb-6"
              initial={{ scale: 0.8, opacity: 0, y: -100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />
            <motion.h1
              className="text-3xl font-medium text-white/80 font-mono tracking-wide"
              variants={itemVariants}
            >
              Welcome to Soulcare
            </motion.h1>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            className="mb-8 w-full bg-gradient-to-br hero-section font-mono p-8 rounded-2xl backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.h2
              className="text-4xl font-bold mb-4 bg-gradient-to-r text-white" 
            >
              Your AI Companion for Mental Wellness
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8" 
            >
              Experience personalized support and guidance to help you navigate
              life's challenges and achieve emotional well-being.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4" 
            >
              <motion.button
                onClick={() => navigate("/chat")}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                  rounded-xl text-white font-medium text-lg
                  hover:from-purple-700 hover:to-pink-700 
                  transform transition-all duration-200
                  hover:scale-105 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Chatting Now
              </motion.button>

              <motion.button
                onClick={handleStartTest}
                className="px-8 py-4 border-4 border-purple-600
                  rounded-xl text-gray-300 font-medium
                  hover:bg-purple-500/10 hover:text-white hover:border-purple-600
                  transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take Quick Stress Test
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Test Sections */}
        <div className="w-full mb-8" ref={testSectionRef}>
          {showTest && testScore === null && (
            <motion.div
              variants={testVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mb-4"
            >
              <StressTest
                onComplete={(score, analysisResult) => {
                  setTestScore(score);
                  setAnalysis(analysisResult);
                  setShowTest(false);
                }}
              />
            </motion.div>
          )}

          {testScore !== null && (
            <motion.div
              variants={testVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mb-4"
            >
              <TestResults
                score={testScore}
                analysis={analysis}
                onStartChat={onStartChat}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
