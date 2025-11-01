import { NextResponse } from 'next/server'

export interface CorsConfig {
  allowedOrigins: string[]
  allowedMethods: string[]
  allowedHeaders: string[]
  allowCredentials: boolean
  maxAge?: number
}

export const defaultCorsConfig: CorsConfig = {
  allowedOrigins: [
    'https://welcomplay.com',
    'https://www.welcomplay.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  allowCredentials: true,
  maxAge: 86400 // 24 hours
}

export function addCorsHeaders(response: NextResponse, config: CorsConfig = defaultCorsConfig): NextResponse {
  const origin = response.headers.get('origin')
  
  // Set CORS headers
  if (origin && config.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '))
  response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
  response.headers.set('Access-Control-Allow-Credentials', config.allowCredentials.toString())
  
  if (config.maxAge) {
    response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
  }
  
  return response
}

export function createCorsResponse(config: CorsConfig = defaultCorsConfig): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return addCorsHeaders(response, config)
}
