import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { text, numQuestions = 5, questionType = 'mixed', difficulty = 'medium' } = await request.json()
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }
    
    // Chunk text if too long (Gemini has input limits)
    const maxChunkLength = 8000
    let processedText = text
    if (text.length > maxChunkLength) {
      processedText = text.substring(0, maxChunkLength)
    }
    
    // Create prompt based on settings
    let prompt = `Generate exactly ${numQuestions} quiz questions from the following text. `
    
    if (questionType === 'mcq') {
      prompt += 'Create only multiple choice questions with 4 options each. '
    } else if (questionType === 'true_false') {
      prompt += 'Create only true/false questions. '
    } else {
      prompt += 'Create a mix of multiple choice questions (4 options each) and true/false questions. '
    }
    
    prompt += `Make the questions ${difficulty} difficulty level. `
    prompt += `Return the response as a valid JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text here",
      "type": "multiple_choice" or "true_false",
      "options": ["A", "B", "C", "D"] (only for multiple_choice, omit for true_false),
      "correctAnswer": "Correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

TEXT TO ANALYZE:
${processedText}`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    let generatedText = response.text()
    
    // Clean up the response to extract JSON
    generatedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    let quizData
    try {
      quizData = JSON.parse(generatedText)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Generated text:', generatedText)
      
      // Fallback: try to extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          quizData = JSON.parse(jsonMatch[0])
        } catch (fallbackError) {
          throw new Error('Failed to parse AI response as JSON')
        }
      } else {
        throw new Error('No valid JSON found in AI response')
      }
    }
    
    // Validate response structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid response structure from AI')
    }
    
    // Ensure we have the right number of questions
    if (quizData.questions.length === 0) {
      throw new Error('No questions generated')
    }
    
    // Validate each question
    quizData.questions = quizData.questions.map((q, index) => {
      if (!q.question || !q.correctAnswer) {
        throw new Error(`Question ${index + 1} missing required fields`)
      }
      
      // Set default type if missing
      if (!q.type) {
        q.type = q.options ? 'multiple_choice' : 'true_false'
      }
      
      // Ensure multiple choice questions have options
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        q.options = ['True', 'False']
        q.type = 'true_false'
      }
      
      return q
    })
    
    return NextResponse.json(quizData)
    
  } catch (error) {
    console.error('Error generating quiz:', error)
    
    // Return a fallback response with sample questions
    const fallbackQuestions = {
      questions: [
        {
          question: "What is the main topic discussed in the uploaded document?",
          type: "multiple_choice",
          options: ["Technology", "Science", "Literature", "History"],
          correctAnswer: "Please review the document to determine the correct answer",
          explanation: "This is a sample question. The AI service encountered an error."
        }
      ]
    }
    
    return NextResponse.json(fallbackQuestions)
  }
}
