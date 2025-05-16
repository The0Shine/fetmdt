import type React from 'react'

import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Lock,
    UserPlus,
    X,
    User,
    Mail,
    Phone,
    Shield,
} from 'lucide-react'

// Định nghĩa kiểu dữ liệu cho người dùng
interface UserData {
    id: number
    name: string
    email: string
    phone: string
    role: string
    status: 'active' | 'inactive'
    lastLogin: string
    avatar?: string
}

// Dữ liệu mẫu
const initialUsers: UserData[] = [
    {
        id: 1,
        name: 'Nguyễn Văn Admin',
        email: 'admin@example.com',
        phone: '0987654321',
        role: 'Quản trị viên',
        status: 'active',
        lastLogin: 'Hôm nay, 10:30',
        avatar: '',
    },
    {
        id: 2,
        name: 'Trần Thị Bán Hàng',
        email: 'sales@example.com',
        phone: '0987654322',
        role: 'Nhân viên bán hàng',
        status: 'active',
        lastLogin: 'Hôm nay, 09:15',
        avatar: '',
    },
    {
        id: 3,
        name: 'Lê Văn Kho',
        email: 'inventory@example.com',
        phone: '0987654323',
        role: 'Nhân viên kho',
        status: 'active',
        lastLogin: 'Hôm qua, 17:30',
        avatar: '',
    },
    {
        id: 4,
        name: 'Phạm Thị Kế Toán',
        email: 'accounting@example.com',
        phone: '0987654324',
        role: 'Kế toán',
        status: 'active',
        lastLogin: 'Hôm qua, 16:45',
        avatar: '',
    },
    {
        id: 5,
        name: 'Hoàng Văn Bán Hàng',
        email: 'sales2@example.com',
        phone: '0987654325',
        role: 'Nhân viên bán hàng',
        status: 'inactive',
        lastLogin: '20/04/2023, 14:20',
        avatar: '',
    },
    {
        id: 6,
        name: 'Ngô Thị Kho',
        email: 'inventory2@example.com',
        phone: '0987654326',
        role: 'Nhân viên kho',
        status: 'active',
        lastLogin: '21/04/2023, 08:10',
        avatar: '',
    },
    {
        id: 7,
        name: 'Đỗ Văn Bán Hàng',
        email: 'sales3@example.com',
        phone: '0987654327',
        role: 'Nhân viên bán hàng',
        status: 'active',
        lastLogin: '21/04/2023, 11:30',
        avatar: '',
    },
    {
        id: 8,
        name: 'Lý Thị Kế Toán',
        email: 'accounting2@example.com',
        phone: '0987654328',
        role: 'Kế toán',
        status: 'inactive',
        lastLogin: '19/04/2023, 15:45',
        avatar: '',
    },
]

// Danh sách vai trò
const roles = [
    'Quản trị viên',
    'Nhân viên bán hàng',
    'Nhân viên kho',
    'Kế toán',
]

export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<UserData[]>([])
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
        useState(false)
    const [resetPasswordUserId, setResetPasswordUserId] = useState<
        number | null
    >(null)

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Mở modal thêm người dùng mới
    const handleAddUser = () => {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    // Mở modal chỉnh sửa người dùng
    const handleEditUser = (user: UserData) => {
        setEditingUser(user)
        setIsModalOpen(true)
    }

    // Xử lý xóa người dùng
    const handleDeleteUser = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            setUsers(users.filter((user) => user.id !== id))
        }
    }

    // Mở modal đặt lại mật khẩu
    const handleResetPassword = (id: number) => {
        setResetPasswordUserId(id)
        setIsResetPasswordModalOpen(true)
    }

    // Lọc dữ liệu dựa trên trạng thái, vai trò và tìm kiếm
    const filteredData = useMemo(() => {
        let filtered = [...users]

        // Lọc theo vai trò
        if (filterRole !== 'all') {
            filtered = filtered.filter((user) => user.role === filterRole)
        }

        // Lọc theo trạng thái
        if (filterStatus !== 'all') {
            filtered = filtered.filter((user) => user.status === filterStatus)
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower) ||
                    user.phone.includes(searchLower),
            )
        }

        return filtered
    }, [users, filterRole, filterStatus, searchTerm])

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Tên người dùng',
            selector: (row: UserData) => row.name,
            sortable: true,
            cell: (row: UserData) => (
                <div className="flex items-center py-2">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                        {row.avatar ? (
                            <img
                                src={row.avatar || '/placeholder.svg'}
                                alt={row.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User size={16} className="text-gray-500" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.role}</div>
                    </div>
                </div>
            ),
        },
        {
            name: 'Email',
            selector: (row: UserData) => row.email,
            sortable: true,
        },
        {
            name: 'Số điện thoại',
            selector: (row: UserData) => row.phone,
            sortable: true,
        },
        {
            name: 'Trạng thái',
            selector: (row: UserData) => row.status,
            sortable: true,
            cell: (row: UserData) => {
                const statusClass =
                    row.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                const statusText =
                    row.status === 'active' ? 'Hoạt động' : 'Không hoạt động'

                return (
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
                    >
                        {statusText}
                    </span>
                )
            },
        },
        {
            name: '',
            cell: (row: UserData) => (
                <div className="flex space-x-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditUser(row)}
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="text-orange-500 hover:text-orange-700"
                        onClick={() => handleResetPassword(row.id)}
                        title="Đặt lại mật khẩu"
                    >
                        <Lock size={16} />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteUser(row.id)}
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            button: true,
            width: '120px',
        },
    ]

    // Tùy chỉnh style cho DataTable
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase' as const,
                fontWeight: '600',
                letterSpacing: '0.05em',
            },
        },
        rows: {
            style: {
                minHeight: '56px',
                fontSize: '0.875rem',
                color: '#111827',
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
            },
            stripedStyle: {
                backgroundColor: '#f9fafb',
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #e5e7eb',
                fontSize: '0.875rem',
            },
            pageButtonsStyle: {
                color: '#6b7280',
                fill: '#6b7280',
                '&:hover:not(:disabled)': {
                    backgroundColor: '#f3f4f6',
                },
                '&:focus': {
                    outline: 'none',
                },
            },
        },
    }

    // Tùy chỉnh component phân trang
    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng:',
        rangeSeparatorText: 'trên',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tất cả',
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Quản lý người dùng
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Người dùng</span>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                        Danh sách người dùng
                    </h2>
                    <button
                        className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        onClick={handleAddUser}
                    >
                        <Plus size={16} className="mr-1" /> Thêm người dùng
                    </button>
                </div>

                <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm theo tên/email/SĐT"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                                Vai trò:
                            </span>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none md:w-40"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                                Trạng thái:
                            </span>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none md:w-40"
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                            >
                                <option value="all">Tất cả</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">
                                    Không hoạt động
                                </option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            <Filter size={16} className="mr-2" />
                            <span>Lọc khác</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        paginationResetDefaultPage={resetPaginationToggle}
                        paginationComponentOptions={paginationComponentOptions}
                        selectableRows
                        onSelectedRowsChange={(state) =>
                            setSelectedRows(state.selectedRows)
                        }
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="p-4 text-center text-gray-500">
                                Không có người dùng nào
                            </div>
                        }
                        persistTableHead
                    />
                </div>
            </div>

            {isModalOpen && (
                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={editingUser}
                    onSave={(user) => {
                        if (user.id) {
                            setUsers(
                                users.map((u) => (u.id === user.id ? user : u)),
                            )
                        } else {
                            const newId =
                                Math.max(...users.map((u) => u.id), 0) + 1
                            setUsers([
                                ...users,
                                {
                                    ...user,
                                    id: newId,
                                    lastLogin: 'Chưa đăng nhập',
                                },
                            ])
                        }
                        setIsModalOpen(false)
                    }}
                    roles={roles}
                />
            )}

            {isResetPasswordModalOpen && (
                <ResetPasswordModal
                    isOpen={isResetPasswordModalOpen}
                    onClose={() => setIsResetPasswordModalOpen(false)}
                    userId={resetPasswordUserId}
                    onReset={() => {
                        // Xử lý đặt lại mật khẩu
                        setIsResetPasswordModalOpen(false)
                        alert('Đã gửi email đặt lại mật khẩu thành công!')
                    }}
                />
            )}
        </div>
    )
}

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    user: UserData | null
    onSave: (user: UserData) => void
    roles: string[]
}

function UserModal({ isOpen, onClose, user, onSave, roles }: UserModalProps) {
    const [formData, setFormData] = useState<Partial<UserData>>(
        user || {
            name: '',
            email: '',
            phone: '',
            role: roles[0],
            status: 'active',
            avatar: '',
        },
    )

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData as UserData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="flex items-center text-xl font-semibold">
                        <UserPlus className="mr-2 text-teal-500" size={20} />
                        {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div
                        className="overflow-y-auto p-6"
                        style={{ maxHeight: 'calc(90vh - 130px)' }}
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Tên người dùng{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                        <User size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Email{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="role"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Vai trò{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                        <Shield size={16} />
                                    </div>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role || ''}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    >
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Trạng thái
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status || 'active'}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">
                                        Không hoạt động
                                    </option>
                                </select>
                            </div>

                            {!user && (
                                <div className="md:col-span-2">
                                    <div className="rounded-md bg-yellow-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <Lock
                                                    className="h-5 w-5 text-yellow-400"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Thông tin mật khẩu
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>
                                                        Mật khẩu mặc định sẽ
                                                        được tạo và gửi đến
                                                        email của người dùng.
                                                        Người dùng sẽ được yêu
                                                        cầu đổi mật khẩu khi
                                                        đăng nhập lần đầu.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t p-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        >
                            {user ? 'Cập nhật' : 'Thêm người dùng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface ResetPasswordModalProps {
    isOpen: boolean
    onClose: () => void
    userId: number | null
    onReset: () => void
}

function ResetPasswordModal({
    isOpen,
    onClose,
    userId,
    onReset,
}: ResetPasswordModalProps) {
    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="flex items-center text-xl font-semibold">
                        <Lock className="mr-2 text-teal-500" size={20} />
                        Đặt lại mật khẩu
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="mb-4 text-gray-700">
                        Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng
                        này? Một email sẽ được gửi đến người dùng với hướng dẫn
                        đặt lại mật khẩu.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={onReset}
                            className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        >
                            Đặt lại mật khẩu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
