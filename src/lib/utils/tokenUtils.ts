// Token utility functions

export const isTokenValid = (token: string): boolean => {
  try {
    if (!token) return false
    
    const decoded = decodeToken(token)
    if (!decoded) return false
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTime
  } catch (error) {
    return false
  }
}

export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true
    
    const decoded = decodeToken(token)
    if (!decoded) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp <= currentTime
  } catch (error) {
    return true
  }
}

export const shouldRefreshToken = (token: string, thresholdMinutes: number = 5): boolean => {
  try {
    if (!token) return true
    
    const decoded = decodeToken(token)
    if (!decoded) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    const thresholdSeconds = thresholdMinutes * 60
    return decoded.exp <= (currentTime + thresholdSeconds)
  } catch (error) {
    return true
  }
}

export const getTokenExpiryTime = (token: string): number | null => {
  try {
    if (!token) return null
    
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return null
    
    return decoded.exp * 1000 // Convert to milliseconds
  } catch (error) {
    return null
  }
}

export const getTimeUntilExpiry = (token: string): number | null => {
  try {
    if (!token) return null
    
    const expiryTime = getTokenExpiryTime(token)
    if (!expiryTime) return null
    
    const currentTime = Date.now()
    return Math.max(0, expiryTime - currentTime)
  } catch (error) {
    return null
  }
}

export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}

export const getTokenPayload = (token: string): any => {
  return decodeToken(token)
}

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token)
    return decoded?.userId || decoded?.sub || null
  } catch (error) {
    return null
  }
}

export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const decoded = decodeToken(token)
    return decoded?.role || null
  } catch (error) {
    return null
  }
}

export const getTokenIssuedAt = (token: string): number | null => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.iat) return null
    
    return decoded.iat * 1000 // Convert to milliseconds
  } catch (error) {
    return null
  }
}

export const isTokenRecentlyIssued = (token: string, thresholdMinutes: number = 5): boolean => {
  try {
    if (!token) return false
    
    const issuedAt = getTokenIssuedAt(token)
    if (!issuedAt) return false
    
    const currentTime = Date.now()
    const thresholdMs = thresholdMinutes * 60 * 1000
    
    return (currentTime - issuedAt) <= thresholdMs
  } catch (error) {
    return false
  }
}

export default {
  isTokenValid,
  isTokenExpired,
  shouldRefreshToken,
  getTokenExpiryTime,
  getTimeUntilExpiry,
  decodeToken,
  getTokenPayload,
  getUserIdFromToken,
  getUserRoleFromToken,
  getTokenIssuedAt,
  isTokenRecentlyIssued
}
