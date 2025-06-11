'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../contexts/auth-context'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { changePassword } from '@/services/apiAuth.service'

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, {
            message: 'Mật khẩu hiện tại phải có ít nhất 6 ký tự',
        }),
        newPassword: z.string().min(6, {
            message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
        }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmPassword'],
    })

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ChangePasswordForm() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(data: PasswordFormValues) {
        if (!user?._id) {
            toast.error('Bạn cần đăng nhập để thực hiện thao tác này')
            return
        }

        setIsLoading(true)
        try {
            const res = await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            })
            if (res) {
                toast.success('Đổi mật khẩu thành công')
                form.reset()
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Đổi mật khẩu thất bại',
            )
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
                <p className="text-muted-foreground text-sm">
                    Cập nhật mật khẩu của bạn để bảo mật tài khoản
                </p>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu hiện tại</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Nhập mật khẩu hiện tại"
                                            type={
                                                showCurrentPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 right-3 -translate-y-1/2"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword,
                                                )
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Nhập mật khẩu mới"
                                            type={
                                                showNewPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 right-3 -translate-y-1/2"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword,
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Xác nhận mật khẩu mới"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 right-3 -translate-y-1/2"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
