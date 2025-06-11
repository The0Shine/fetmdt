'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Loader2, Upload, X } from 'lucide-react'
import apiUploadService from '../../../services/apiUpload.service'
import { useAuth } from '../../contexts/auth-context'
import { toast } from 'sonner'
import { apiUserService } from '@/services/apiUser.service'

export default function AvatarUpload() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh')
            return
        }

        // Kiểm tra kích thước file (giới hạn 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 2MB')
            return
        }

        setSelectedFile(file)
        const reader = new FileReader()
        reader.onload = () => {
            setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleUpload = async () => {
        if (!selectedFile || !user?._id) return

        setIsLoading(true)
        try {
            // Upload ảnh lên Cloudinary
            const uploadResponse =
                await apiUploadService.uploadSingle(selectedFile)
            const imageUrl = uploadResponse.data.secure_url

            // Cập nhật avatar cho user
            await apiUserService.updateUser(user._id, {
                avatar: imageUrl,
            })

            // Cập nhật thông tin user trong context

            toast.success('Cập nhật ảnh đại diện thành công')

            // Reset state
            setSelectedFile(null)
            setPreviewUrl(null)
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    'Cập nhật ảnh đại diện thất bại',
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Ảnh đại diện</h3>
                <p className="text-muted-foreground text-sm">
                    Cập nhật ảnh đại diện của bạn
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={previewUrl || user?.avatar} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                {!previewUrl ? (
                    <div className="flex flex-col items-center space-y-2">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2"
                        >
                            <Camera className="h-4 w-4" />
                            Chọn ảnh
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="text-muted-foreground text-xs">
                            JPG, PNG hoặc GIF. Tối đa 2MB.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            {isLoading ? 'Đang tải lên...' : 'Lưu ảnh'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Hủy
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
