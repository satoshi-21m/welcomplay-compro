import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthData = {
      success: true,
      message: 'Frontend is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      appName: process.env.NEXT_PUBLIC_APP_NAME || 'Welcomplay Admin',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    const errorData = {
      success: false,
      message: 'Frontend health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json(errorData, { status: 500 })
  }
}
