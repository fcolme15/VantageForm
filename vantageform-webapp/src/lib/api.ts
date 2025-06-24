interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiCall = async <T = any>(
  endpoint: string, 
  options: ApiCallOptions = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: ApiCallOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}