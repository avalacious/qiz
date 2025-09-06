'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import QuizCard from '../components/QuizCard'
import Loader from '../components/Loader'
import { Download, Settings, BookOpen, Brain } from 'lucide-react'
import { saveAs } from 'file-saver'

export default function Home() {
  const [pdfText, setPdfText] = useState('')
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    numQuestions: 5,
    questionType: 'mixed',
    difficulty: 'medium'
  })

  const handleFileUpload = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to parse PDF')
      }

      const data = await response.json()
      setPdfText(data.text)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = async () => {
    if (!pdfText) {
      alert('Please upload a PDF first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: pdfText,
          ...settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuizData(data)
    } catch (error) {
      console.error('Error generating quiz:', error)
      alert('Error generating quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportQuiz = (format) => {
    if (!quizData) return

    let content = ''
    
    if (format === 'txt') {
      content = quizData.questions.map((q, i) => {
        let questionText = `${i + 1}. ${q.question}\n`
        
        if (q.type === 'multiple_choice') {
          q.options.forEach((option, j) => {
            questionText += `   ${String.fromCharCode(97 + j)}) ${option}\n`
          })
          questionText += `   Answer: ${q.correctAnswer}\n\n`
        } else {
          questionText += `   Answer: ${q.correctAnswer}\n\n`
        }
        
        return questionText
      }).join('')
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, 'quiz-questions.txt')
    } else if (format === 'csv') {
      const headers = 'Question,Type,Options,Correct Answer\n'
      content = headers + quizData.questions.map(q => {
        const options = q.type === 'multiple_choice' ? q.options.join('; ') : 'True/False'
        return `"${q.question}","${q.type}","${options}","${q.correctAnswer}"`
      }).join('\n')
      
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, 'quiz-questions.csv')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="gradient-bg min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mb-4"
              >
                <Brain className="w-16 h-16 text-white mx-auto" />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
                AI Quiz
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  {' '}Generator
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Transform your PDF chapters into engaging quiz questions instantly using advanced AI
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-white mr-2" />
                  <h3 className="text-xl font-semibold text-white">Upload PDF</h3>
                </div>
                <FileUpload onFileUpload={handleFileUpload} />
              </motion.div>

              {/* Settings Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex items-center mb-4">
                  <Settings className="w-6 h-6 text-white mr-2" />
                  <h3 className="text-xl font-semibold text-white">Quiz Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Number of Questions</label>
                    <select
                      value={settings.numQuestions}
                      onChange={(e) => setSettings({...settings, numQuestions: parseInt(e.target.value)})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2">Question Type</label>
                    <select
                      value={settings.questionType}
                      onChange={(e) => setSettings({...settings, questionType: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="mixed">Mixed (MCQ + True/False)</option>
                      <option value="mcq">Multiple Choice Only</option>
                      <option value="true_false">True/False Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2">Difficulty Level</label>
                    <select
                      value={settings.difficulty}
                      onChange={(e) => setSettings({...settings, difficulty: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <button
                onClick={generateQuiz}
                disabled={!pdfText || loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-xl font-semibold hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-on-hover"
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Loader />
          </motion.div>
        )}

        {/* Quiz Results */}
        {quizData && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12 p-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Generated Quiz</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => exportQuiz('txt')}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Export TXT
                  </button>
                  <button
                    onClick={() => exportQuiz('csv')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                {quizData.questions.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <QuizCard question={question} index={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
