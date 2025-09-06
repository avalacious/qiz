import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Parse PDF
    const data = await pdf(buffer)
    
    if (!data.text || data.text.trim().length === 0) {
      return NextResponse.json({ error: 'No text found in PDF' }, { status: 400 })
    }
    
    return NextResponse.json({
      text: data.text,
      pages: data.numpages,
      filename: file.name
    })
    
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF. Please try again.' },
      { status: 500 }
    )
  }
}
