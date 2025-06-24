export interface User {
    id: string
    email: string
    role?: string
}

export interface Session {
    access_token: string
    refresh_token: string
    expires_in: number
    user: User
}
  
export interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
    signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
    signOut: () => Promise<{ error: any }>
    getAuthHeader: () => Record<string, string>
}
  
export interface ApiResponse<T = any> {
    data?: T
    message?: string
    error?: string
    userId?: string
    timestamp?: string
}