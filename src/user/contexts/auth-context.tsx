'use client'

import type React from 'react'
import { createContext, useState, useEffect, useContext } from 'react'
import type { User } from '../../types/user'
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
    updatePassword: (
        oldPassword: string,
        newPassword: string,
    ) => Promise<boolean>
    loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true) // Bắt đầu với loading = true
    const navigate = useNavigate()

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('access_token')

            // Nếu không có token, set loading = false và return
            if (!accessToken) {
                setUser(null)
                setIsAuthenticated(false)
                setLoading(false)
                return
            }

            try {
                // Thử lấy thông tin user với token hiện tại
                const userData = await getMe()

                if (userData) {
                    setUser(userData)
                    setIsAuthenticated(true)
                } else {
                    // Nếu không lấy được user data, clear tokens
                    setUser(null)
                    setIsAuthenticated(false)
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)

                // Nếu có lỗi (token expired, invalid, etc.), clear tokens
                setUser(null)
                setIsAuthenticated(false)
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')

                // Có thể thử refresh token ở đây nếu cần
                // await tryRefreshToken()
            } finally {
                // Luôn set loading = false sau khi hoàn thành
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true) // Set loading khi đang login

            const response = await loginApi({ username: email, password })
            console.log('Login response:', response)

            if (
                response &&
                typeof response === 'object' &&
                'data' in response
            ) {
                const { accessToken, refreshToken } = response.data as {
                    accessToken: string
                    refreshToken: string
                }

                localStorage.setItem('access_token', accessToken)
                localStorage.setItem('refresh_token', refreshToken)

                const userData = await getMe()
                setUser(userData)
                setIsAuthenticated(true)

                if (userData?.role?.name === 'user') {
                    navigate('/')
                } else {
                    navigate('/admin/')
                }
                return true
            }
            return false
        } catch (error) {
            console.error('Login failed:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login', { replace: true })
    }

    const register = async (
        name: string,
        email: string,
        password: string,
    ): Promise<boolean> => {
        try {
            setLoading(true)

            const response = await mainRepository.post('/api/auth/register', {
                name,
                email,
                password,
            })

            if (
                response &&
                typeof response === 'object' &&
                'success' in response &&
                'data' in response
            ) {
                const data = response.data as {
                    accessToken: string
                    refreshToken: string
                    user: User
                }

                localStorage.setItem('access_token', data.accessToken)
                localStorage.setItem('refresh_token', data.refreshToken)
                setUser(data.user)
                setIsAuthenticated(true)
                return true
            }
            return false
        } catch (error) {
            console.error('Registration failed:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async (
        oldPassword: string,
        newPassword: string,
    ): Promise<boolean> => {
        try {
            const response = await mainRepository.put('/api/users/password', {
                oldPassword,
                newPassword,
            })

            return (response &&
                typeof response === 'object' &&
                'success' in response &&
                (response as { success: boolean }).success === true) as boolean
        } catch (error) {
            console.error('Password update failed:', error)
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
                updatePassword,
                loading, // Đảm bảo loading được truyền vào context
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
