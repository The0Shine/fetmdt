'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import type { User as UserType } from '../../../types/user'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '../../../components/ui/tabs'
import { mainRepository } from '../../../utils/Repository'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import ChangePasswordForm from './change-password-form'
import { apiUserService } from '@/services/apiUser.service'

const profileSchema = z.object({
    firstName: z.string().min(2, {
        message: 'Tên phải có ít nhất 2 ký tự',
    }),
    lastName: z.string().min(2, {
        message: 'Họ phải có ít nhất 2 ký tự',
    }),
    email: z.string().email({
        message: 'Email không hợp lệ',
    }),
    phone: z.string().optional(),
    address: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// Interfaces cho dữ liệu địa chỉ
interface Province {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
}

interface District {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    province_code: string
}

interface Ward {
    code: string
    name: string
    name_en: string
    full_name: string
    full_name_en: string
    code_name: string
    district_code: string
}

const ProfileForm: React.FC = () => {
    const { user, updateUserInfo } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const [formData, setFormData] = useState<Partial<UserType>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        avatar: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                district: user.district || '',
                ward: user.ward || '',
                avatar: user.avatar || '',
            })
        }
    }, [user])

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        if (!user?._id) {
            toast.error('Bạn cần đăng nhập để thực hiện thao tác này')
            return
        }

        setIsLoading(true)
        try {
            const response = await apiUserService.updateUser(user._id, data)

            toast.success('Cập nhật thông tin thành công')
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Cập nhật thông tin thất bại',
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Quản lý tài khoản
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {message && (
                        <Alert
                            className={`mb-6 ${
                                message.type === 'success'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-red-500 bg-red-50'
                            }`}
                        >
                            <AlertDescription
                                className={
                                    message.type === 'success'
                                        ? 'text-green-700'
                                        : 'text-red-700'
                                }
                            >
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">
                                Thông tin cá nhân
                            </TabsTrigger>

                            <TabsTrigger value="password">
                                Đổi mật khẩu
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="mt-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        Thông tin cá nhân
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Cập nhật thông tin cá nhân của bạn
                                    </p>
                                </div>
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tên
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Tên của bạn"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Họ
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Họ của bạn"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Email của bạn"
                                                            {...field}
                                                            disabled
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Số điện thoại
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Số điện thoại của bạn"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Địa chỉ
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Địa chỉ của bạn"
                                                            className="resize-none"
                                                            {...field}
                                                        />
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
                                            {isLoading
                                                ? 'Đang xử lý...'
                                                : 'Cập nhật thông tin'}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </TabsContent>

                        <TabsContent value="password" className="mt-6">
                            <ChangePasswordForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProfileForm
