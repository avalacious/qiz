'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle } from 'lucide-react'

export default function FileUpload({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find(file => file.type === 'application/pdf')
    
    if (pdfFile) {
      setUploadedFile(pdfFile)
      onFileUpload(pdfFile)
    } else {
      alert('Please upload a PDF file')
    }
  }, [onFileUpload])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file)
      onFileUpload(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  return (
    <div className="w-full">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-blue-400 bg-blue-50/10 scale-105' 
            : 'border-white/30 hover:border-white/50'
          }
          ${uploadedFile ? 'border-green-400 bg-green-50/10' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
            <div className="text-white">
              <p className="font-semibold">File uploaded successfully!</p>
              <p className="text-sm text-white/70">{uploadedFile.name}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-4"
            animate={isDragging ? { y: -5 } : { y: 0 }}
          >
            <motion.div
              animate={{ 
                rotate: isDragging ? [0, 5, -5, 0] : 0,
                scale: isDragging ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {isDragging ? (
                <Upload className="w-12 h-12 text-blue-400" />
              ) : (
                <FileText className="w-12 h-12 text-white/70" />
              )}
            </motion.div>

            <div className="text-white">
              <p className="text-lg font-semibold mb-2">
                {isDragging ? 'Drop your PDF here' : 'Upload PDF Chapter'}
              </p>
              <p className="text-sm text-white/70">
                Drag & drop or click to select a PDF file
              </p>
            </div>

            <motion.div
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Files
            </motion.div>
          </motion.div>
        )}

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-400/20 rounded-2xl flex items-center justify-center"
          >
            <div className="text-blue-100 text-xl font-semibold">
              Drop to upload
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-4 text-center">
        <p className="text-xs text-white/50">
          Supported format: PDF (Max 10MB)
        </p>
      </div>
    </div>
  )
}
