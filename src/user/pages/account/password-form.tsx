'use client'

import type React from 'react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'

const PasswordForm: React.FC = () => {
    const { updatePassword } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        // Validate passwords
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Mật khẩu mới và xác nhận mật khẩu không khớp.',
            })
            return
        }

        if (formData.newPassword.length < 6) {
            setMessage({
                type: 'error',
                text: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
            })
            return
        }

        setIsLoading(true)

        try {
            const success = await updatePassword(
                formData.currentPassword,
                formData.newPassword,
            )
            if (success) {
                setMessage({
                    type: 'success',
                    text: 'Mật khẩu đã được cập nhật thành công!',
                })
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })
            } else {
                setMessage({
                    type: 'error',
                    text: 'Mật khẩu hiện tại không chính xác.',
                })
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Có lỗi xảy ra khi cập nhật mật khẩu.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div
                    className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                >
                    {message.text}
                </div>
            )}

            <div>
                <label
                    htmlFor="currentPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Mật khẩu hiện tại
                </label>
                <div className="relative">
                    <input
                        type={
                            showPasswords.currentPassword ? 'text' : 'password'
                        }
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500"
                        onClick={() =>
                            togglePasswordVisibility('currentPassword')
                        }
                    >
                        {showPasswords.currentPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Mật khẩu mới
                </label>
                <div className="relative">
                    <input
                        type={showPasswords.newPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500"
                        onClick={() => togglePasswordVisibility('newPassword')}
                    >
                        {showPasswords.newPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 6 ký tự
                </p>
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                    <input
                        type={
                            showPasswords.confirmPassword ? 'text' : 'password'
                        }
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500"
                        onClick={() =>
                            togglePasswordVisibility('confirmPassword')
                        }
                    >
                        {showPasswords.confirmPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
            </div>
        </form>
    )
}

export default PasswordForm
