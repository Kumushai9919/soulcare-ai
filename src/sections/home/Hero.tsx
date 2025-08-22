import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import StressTest from "./StressTest";
import TestResults from "./TestResults";
import { getRandomQuote } from "../../data/quotes";

type FeaturesProps = {
  onStartChat: () => void;
};

export default function Hero({ onStartChat }: FeaturesProps) {
  const [showTest, setShowTest] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [quote] = useState(getRandomQuote());
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
      transition: { duration: 0.9 },
    },
  };

  const testVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-y-auto p-4">
      <div className="container mx-auto px-4 pb-8">
        <motion.div className="min-h-screen py-16 flex flex-col items-center justify-center"   variants={containerVariants}
          initial="hidden"
          animate="show">
          {/* Initial Welcome with Quote */}
          <motion.div className="mb-16 relative w-full" variants={itemVariants}>
            <div className="relative pt-16 sm:pt-24">
              {/* Quote positioned higher */}
              <motion.div
                className="font-sans absolute -top-8 sm:-top-12 right-0 sm:right-4 max-w-[200px] sm:max-w-xs text-right "
                variants={itemVariants}
              >
                <p className="text-white/90  text-md sm:text-2xl italic font-light leading-relaxed">
                  " {quote} "
                </p>
              </motion.div>
              <motion.img
                src="/soul2.png"
                alt="Soulcare Logo"
                className="h-48 sm:h-96 mx-auto mb-6"
                initial={{ scale: 0.8, opacity: 0, y: -100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </div>
            <motion.h1
              className="text-lg sm:text-3xl font-medium text-white/80 font-mono tracking-wide text-center"
              variants={itemVariants}
              
            >
              Welcome to Soulcare
            </motion.h1>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            className="max-w-5xl mb-8 w-full bg-gradient-to-br hero-section font-mono p-4 sm:p-16 rounded-2xl backdrop-blur-sm"
            variants={itemVariants}
            
          >
            <motion.h2 className="font-mono text-xl sm:text-4xl font-bold mb-4 bg-gradient-to-r text-white text-center">
              Your AI friend for stress support
            </motion.h2>
            <motion.p className="text-sm sm:text-lg text-gray-300 mb-8 text-center">
              I’m here to listen and offer gentle, personalized support so you
              can handle life’s ups and downs and feel a bit lighter, one step
              at a time.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4">
              <motion.button
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      sidebarOpen: false,
                      fromHome: true,
                    },
                  })
                }
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                  rounded-xl text-white font-medium text-sm sm:text-lg
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
                className="px-6 sm:px-8 py-3 sm:py-4 border-4 border-purple-600
                  rounded-xl text-gray-300 font-medium text-sm sm:text-lg
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
        <div className="w-full" ref={testSectionRef}>
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
        