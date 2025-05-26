'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Home,
    CreditCard,
    Loader2,
} from 'lucide-react'
import { useAuth } from '../../contexts/auth-context'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { Alert, AlertDescription } from '../../../components/ui/alert'

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

interface CheckoutFormData {
    name: string
    email: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
    paymentMethod: string
    note: string
}

interface CheckoutFormProps {
    onSubmit: (formData: CheckoutFormData) => void
    loading: boolean
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading }) => {
    const { user } = useAuth()
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<CheckoutFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        paymentMethod: 'cod',
        note: '',
    })

    // Address data states
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])

    // Selected values for dropdowns
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('')
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('')
    const [selectedWardCode, setSelectedWardCode] = useState('')

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                district: user.district || '',
                ward: user.ward || '',
            }))
        }
    }, [user])

    // Fetch provinces on component mount
    useEffect(() => {
        fetchProvinces()
    }, [])

    const fetchProvinces = async () => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch('https://provinces.open-api.vn/api/p/')
            const data = await response.json()
            setProvinces(data)
        } catch (error) {
            console.error('Error fetching provinces:', error)
            setError('Không thể tải danh sách tỉnh thành')
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const fetchDistricts = async (provinceCode: string) => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch(
                `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`,
            )
            const data = await response.json()
            setDistricts(data.districts || [])
            setWards([])
            setSelectedDistrictCode('')
            setSelectedWardCode('')
        } catch (error) {
            console.error('Error fetching districts:', error)
            setError('Không thể tải danh sách quận/huyện')
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const fetchWards = async (districtCode: string) => {
        try {
            setIsLoadingAddress(true)
            const response = await fetch(
                `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`,
            )
            const data = await response.json()
            setWards(data.wards || [])
            setSelectedWardCode('')
        } catch (error) {
            console.error('Error fetching wards:', error)
            setError('Không thể tải danh sách phường/xã')
        } finally {
            setIsLoadingAddress(false)
        }
    }

    const handleProvinceChange = (provinceCode: string) => {
        const selectedProvince = provinces.find((p) => p.code === provinceCode)
        if (selectedProvince) {
            setSelectedProvinceCode(provinceCode)
            setFormData((prev) => ({
                ...prev,
                city: selectedProvince.name,
                district: '',
                ward: '',
            }))
            fetchDistricts(provinceCode)
        }
    }

    const handleDistrictChange = (districtCode: string) => {
        const selectedDistrict = districts.find((d) => d.code === districtCode)
        if (selectedDistrict) {
            setSelectedDistrictCode(districtCode)
            setFormData((prev) => ({
                ...prev,
                district: selectedDistrict.name,
                ward: '',
            }))
            fetchWards(districtCode)
        }
    }

    const handleWardChange = (wardCode: string) => {
        const selectedWard = wards.find((w) => w.code === wardCode)
        if (selectedWard) {
            setSelectedWardCode(wardCode)
            setFormData((prev) => ({
                ...prev,
                ward: selectedWard.name,
            }))
        }
    }

    const handleChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Vui lòng nhập họ tên')
            return false
        }

        if (!formData.email.trim()) {
            setError('Vui lòng nhập email')
            return false
        }

        if (!formData.phone.trim()) {
            setError('Vui lòng nhập số điện thoại')
            return false
        }

        if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            setError('Số điện thoại không hợp lệ')
            return false
        }

        if (!formData.address.trim()) {
            setError('Vui lòng nhập địa chỉ')
            return false
        }

        if (!formData.city.trim()) {
            setError('Vui lòng chọn tỉnh/thành phố')
            return false
        }

        if (!formData.district.trim()) {
            setError('Vui lòng chọn quận/huyện')
            return false
        }

        if (!formData.ward.trim()) {
            setError('Vui lòng chọn phường/xã')
            return false
        }

        return true
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Customer Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin khách hàng
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="flex items-center gap-2"
                            >
                                <User className="h-4 w-4" />
                                Họ và tên *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange('name', e.target.value)
                                }
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="flex items-center gap-2"
                            >
                                <Mail className="h-4 w-4" />
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange('email', e.target.value)
                                }
                                placeholder="Nhập địa chỉ email"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                Số điện thoại *
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    handleChange('phone', e.target.value)
                                }
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Địa chỉ giao hàng
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="address"
                            className="flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Địa chỉ cụ thể *
                        </Label>
                        <Input
                            id="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                            placeholder="Số nhà, tên đường..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label
                                htmlFor="city"
                                className="flex items-center gap-2"
                            >
                                <Building className="h-4 w-4" />
                                Tỉnh/Thành phố *
                            </Label>
                            <Select
                                value={selectedProvinceCode}
                                onValueChange={handleProvinceChange}
                                disabled={isLoadingAddress}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            isLoadingAddress
                                                ? 'Đang tải...'
                                                : 'Chọn tỉnh/thành phố'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem
                                            key={province.code}
                                            value={province.code}
                                        >
                                            {province.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="district"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="h-4 w-4" />
                                Quận/Huyện *
                            </Label>
                            <Select
                                value={selectedDistrictCode}
                                onValueChange={handleDistrictChange}
                                disabled={
                                    !selectedProvinceCode || isLoadingAddress
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            isLoadingAddress
                                                ? 'Đang tải...'
                                                : 'Chọn quận/huyện'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem
                                            key={district.code}
                                            value={district.code}
                                        >
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="ward"
                                className="flex items-center gap-2"
                            >
                                <MapPin className="h-4 w-4" />
                                Phường/Xã *
                            </Label>
                            <Select
                                value={selectedWardCode}
                                onValueChange={handleWardChange}
                                disabled={
                                    !selectedDistrictCode || isLoadingAddress
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            isLoadingAddress
                                                ? 'Đang tải...'
                                                : 'Chọn phường/xã'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {wards.map((ward) => (
                                        <SelectItem
                                            key={ward.code}
                                            value={ward.code}
                                        >
                                            {ward.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Phương thức thanh toán
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                            handleChange('paymentMethod', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cod">
                                Thanh toán khi nhận hàng (COD)
                            </SelectItem>
                            <SelectItem value="bank_transfer">
                                Chuyển khoản ngân hàng
                            </SelectItem>
                            <SelectItem value="momo">Ví MoMo</SelectItem>
                            <SelectItem value="zalopay">ZaloPay</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Order Note */}
            <Card>
                <CardHeader>
                    <CardTitle>Ghi chú đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={formData.note}
                        onChange={(e) => handleChange('note', e.target.value)}
                        placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                        rows={3}
                    />
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={loading || isLoadingAddress}
                className="w-full"
                size="lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                    </>
                ) : (
                    'Đặt hàng'
                )}
            </Button>
        </form>
    )
}

export default CheckoutForm
