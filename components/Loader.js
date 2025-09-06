'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          AI is working its magic
        </h3>
        <p className="text-white/70">
          Generating quiz questions from your PDF...
        </p>
      </motion.div>
      
      <motion.div
        className="flex gap-1 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-purple-400 rounded-full"
          />
        ))}
      </motion.div>
      
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4"
      >
        <Sparkles className="w-4 h-4 text-yellow-300" />
      </motion.div>
      
      <motion.div
        animate={{ 
          rotate: [0, -15, 15, 0],
          y: [0, -8, 0]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-0 right-1/4"
      >
        <Sparkles className="w-3 h-3 text-pink-300" />
      </motion.div>
    </div>
  )
}
