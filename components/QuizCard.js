'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react'

export default function QuizCard({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false)

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  return (
    <motion.div
      className="quiz-card rounded-2xl p-6 shadow-xl"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              {index + 1}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              question.type === 'multiple_choice' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {question.type === 'multiple_choice' ? 'Multiple Choice' : 'True/False'}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-4">
            {question.question}
          </h3>

          {question.type === 'multiple_choice' && (
            <div className="space-y-2 mb-4">
              {question.options.map((option, optionIndex) => (
                <motion.div
                  key={optionIndex}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-200"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-white/80">
                    {String.fromCharCode(97 + optionIndex)}) {option}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <motion.button
          onClick={toggleAnswer}
          className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </span>
          {showAnswer ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </motion.button>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>Difficulty: {question.difficulty || 'Medium'}</span>
        </div>
      </div>

      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-green-300">Correct Answer:</span>
                </div>
                <p className="text-white font-medium">
                  {question.correctAnswer}
                </p>
                {question.explanation && (
                  <div className="mt-3 pt-3 border
