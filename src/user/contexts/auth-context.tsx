import type React from 'react'
import { createContext, useState, useEffect, useContext } from 'react'
import { User } from '../../types/user'
import { mainRepository } from '../../utils/Repository'
import { getMe, loginApi } from '../../services/apiAuth.service'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    register: (
        name: string,
        email: string,
        password: string,
    ) => Promise<boolean>
    updateProfile: (userData: Partial<User>) => Promise<boolean>
    updatePassword: (
        oldPassword: string,
        newPassword: string,
    ) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            setUser(null)
            setIsAuthenticated(false)
            return
        }

        const fetchUser = async () => {
            try {
                const response = await mainRepository.get<{ user: User }>(
                    'api/auth/me',
                )
                if (response) {
                    setUser(response.user)
                    setIsAuthenticated(true)
                } else {
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                setUser(null)
                setIsAuthenticated(false)
            }
        }

        fetchUser()
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await loginApi({ username: email, password })
            const { accessToken, refresh_token } = response.data

            localStorage.setItem('access_token', accessToken)
            localStorage.setItem('refresh_token', refresh_token)
            const user = await getMe()
            setUser(user)
            console.log(user)

            localStorage.setItem('user', JSON.stringify(user))

            if (user?.role?.name === 'admin') {
                navigate('/admin/')
            } else {
                navigate('/')
            }
            return true
        } catch (error) {
            console.error('Login failed:', error)
            return false
        }
    }

    const logout = () => {
        mainRepository.post('/logout')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
    }

    const register = async (
        name: string,
        email: string,
        password: string,
    ): Promise<boolean> => {
        try {
            const res = await mainRepository.post<{
                user: User
                accessToken: string
                refreshToken: string
            }>('/register', {
                name,
                email,
                password,
            })
            if (res) {
                const { accessToken, refreshToken, user } = res
                localStorage.setItem('access_token', accessToken)
                localStorage.setItem('refresh_token', refreshToken)
                localStorage.setItem('user', JSON.stringify(user))
                setUser(user)
                setIsAuthenticated(true)
                return true
            }
            return false
        } catch {
            return false
        }
    }

    const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
        try {
            const res = await mainRepository.put<{ user: User }>(
                '/profile',
                userData,
            )
            if (res && res.user) {
                setUser(res.user)
                return true
            }
            return false
        } catch {
            return false
        }
    }

    const updatePassword = async (
        oldPassword: string,
        newPassword: string,
    ): Promise<boolean> => {
        try {
            await mainRepository.put('/password', { oldPassword, newPassword })
            return true
        } catch {
            return false
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                register,
                updateProfile,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
