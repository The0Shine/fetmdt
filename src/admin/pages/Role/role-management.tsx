'use client'

import type React from 'react'

import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { Search, Plus, Edit, Trash2, Shield, UserPlus, X } from 'lucide-react'

// Định nghĩa kiểu dữ liệu cho vai trò
interface Role {
    id: number
    name: string
    description: string
    permissions: Permission[]
    usersCount: number
    createdAt: string
}

interface Permission {
    id: number
    name: string
    module: string
    actions: string[]
}

// Dữ liệu mẫu
const initialRoles: Role[] = [
    {
        id: 1,
        name: 'Quản trị viên',
        description: 'Có tất cả các quyền trong hệ thống',
        permissions: [
            {
                id: 1,
                name: 'Quản lý sản phẩm',
                module: 'products',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 2,
                name: 'Quản lý đơn hàng',
                module: 'orders',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 3,
                name: 'Quản lý khách hàng',
                module: 'customers',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 4,
                name: 'Quản lý kho',
                module: 'inventory',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 5,
                name: 'Quản lý thu chi',
                module: 'finance',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 6,
                name: 'Quản lý người dùng',
                module: 'users',
                actions: ['view', 'create', 'edit', 'delete'],
            },
            {
                id: 7,
                name: 'Quản lý quyền',
                module: 'roles',
                actions: ['view', 'create', 'edit', 'delete'],
            },
        ],
        usersCount: 2,
        createdAt: '15/04/2023',
    },
    {
        id: 2,
        name: 'Nhân viên bán hàng',
        description: 'Quản lý đơn hàng và khách hàng',
        permissions: [
            {
                id: 1,
                name: 'Quản lý sản phẩm',
                module: 'products',
                actions: ['view'],
            },
            {
                id: 2,
                name: 'Quản lý đơn hàng',
                module: 'orders',
                actions: ['view', 'create', 'edit'],
            },
            {
                id: 3,
                name: 'Quản lý khách hàng',
                module: 'customers',
                actions: ['view', 'create', 'edit'],
            },
        ],
        usersCount: 5,
        createdAt: '16/04/2023',
    },
    {
        id: 3,
        name: 'Nhân viên kho',
        description: 'Quản lý kho và sản phẩm',
        permissions: [
            {
                id: 1,
                name: 'Quản lý sản phẩm',
                module: 'products',
                actions: ['view', 'edit'],
            },
            {
                id: 4,
                name: 'Quản lý kho',
                module: 'inventory',
                actions: ['view', 'create', 'edit'],
            },
        ],
        usersCount: 3,
        createdAt: '17/04/2023',
    },
    {
        id: 4,
        name: 'Kế toán',
        description: 'Quản lý tài chính và đơn hàng',
        permissions: [
            {
                id: 2,
                name: 'Quản lý đơn hàng',
                module: 'orders',
                actions: ['view'],
            },
            {
                id: 5,
                name: 'Quản lý thu chi',
                module: 'finance',
                actions: ['view', 'create', 'edit'],
            },
        ],
        usersCount: 2,
        createdAt: '18/04/2023',
    },
]

// Danh sách tất cả các module trong hệ thống
const allModules = [
    {
        id: 1,
        name: 'Quản lý sản phẩm',
        module: 'products',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 2,
        name: 'Quản lý đơn hàng',
        module: 'orders',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 3,
        name: 'Quản lý khách hàng',
        module: 'customers',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 4,
        name: 'Quản lý kho',
        module: 'inventory',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 5,
        name: 'Quản lý thu chi',
        module: 'finance',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 6,
        name: 'Quản lý người dùng',
        module: 'users',
        actions: ['view', 'create', 'edit', 'delete'],
    },
    {
        id: 7,
        name: 'Quản lý quyền',
        module: 'roles',
        actions: ['view', 'create', 'edit', 'delete'],
    },
]

export default function RoleManagement() {
    const [roles, setRoles] = useState<Role[]>(initialRoles)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Role[]>([])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Mở modal thêm vai trò mới
    const handleAddRole = () => {
        setEditingRole(null)
        setIsModalOpen(true)
    }

    // Mở modal chỉnh sửa vai trò
    const handleEditRole = (role: Role) => {
        setEditingRole(role)
        setIsModalOpen(true)
    }

    // Xử lý xóa vai trò
    const handleDeleteRole = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này không?')) {
            setRoles(roles.filter((role) => role.id !== id))
        }
    }

    // Lọc dữ liệu dựa trên tìm kiếm
    const filteredData = useMemo(() => {
        if (!searchTerm) return roles

        const searchLower = searchTerm.toLowerCase()
        return roles.filter(
            (role) =>
                role.name.toLowerCase().includes(searchLower) ||
                role.description.toLowerCase().includes(searchLower),
        )
    }, [roles, searchTerm])

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Tên vai trò',
            selector: (row: Role) => row.name,
            sortable: true,
        },
        {
            name: 'Mô tả',
            selector: (row: Role) => row.description,
            sortable: true,
        },
        {
            name: 'Số người dùng',
            selector: (row: Role) => row.usersCount,
            sortable: true,
            cell: (row: Role) => (
                <div className="flex items-center">
                    <UserPlus size={16} className="mr-2 text-gray-400" />
                    <span>{row.usersCount}</span>
                </div>
            ),
        },
        {
            name: 'Ngày tạo',
            selector: (row: Role) => row.createdAt,
            sortable: true,
        },
        {
            name: '',
            cell: (row: Role) => (
                <div className="flex space-x-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditRole(row)}
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteRole(row.id)}
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            button: true,
            width: '100px',
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
                    Quản lý quyền truy cập
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Quản lý quyền</span>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Danh sách vai trò</h2>
                    <button
                        className="flex items-center rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                        onClick={handleAddRole}
                    >
                        <Plus size={16} className="mr-1" /> Thêm vai trò
                    </button>
                </div>

                <div className="mb-6 flex justify-between">
                    <div className="relative w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm kiếm vai trò"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
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
                                Không có vai trò nào
                            </div>
                        }
                        persistTableHead
                    />
                </div>
            </div>

            {isModalOpen && (
                <RoleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    role={editingRole}
                    onSave={(role) => {
                        if (role.id) {
                            setRoles(
                                roles.map((r) => (r.id === role.id ? role : r)),
                            )
                        } else {
                            const newId =
                                Math.max(...roles.map((r) => r.id), 0) + 1
                            setRoles([
                                ...roles,
                                {
                                    ...role,
                                    id: newId,
                                    createdAt: new Date().toLocaleDateString(
                                        'vi-VN',
                                    ),
                                },
                            ])
                        }
                        setIsModalOpen(false)
                    }}
                    allModules={allModules}
                />
            )}
        </div>
    )
}

interface RoleModalProps {
    isOpen: boolean
    onClose: () => void
    role: Role | null
    onSave: (role: Role) => void
    allModules: Permission[]
}

function RoleModal({
    isOpen,
    onClose,
    role,
    onSave,
    allModules,
}: RoleModalProps) {
    const [formData, setFormData] = useState<Partial<Role>>(
        role || {
            name: '',
            description: '',
            permissions: [],
            usersCount: 0,
        },
    )

    const [selectedPermissions, setSelectedPermissions] = useState<
        Record<string, string[]>
    >(
        role?.permissions.reduce(
            (acc, permission) => {
                acc[permission.module] = permission.actions
                return acc
            },
            {} as Record<string, string[]>,
        ) || {},
    )

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handlePermissionChange = (
        module: string,
        action: string,
        checked: boolean,
    ) => {
        setSelectedPermissions((prev) => {
            const current = prev[module] || []
            if (checked) {
                return { ...prev, [module]: [...current, action] }
            } else {
                return {
                    ...prev,
                    [module]: current.filter((a) => a !== action),
                }
            }
        })
    }

    const handleSelectAllForModule = (module: string, checked: boolean) => {
        const moduleInfo = allModules.find((m) => m.module === module)
        if (moduleInfo) {
            setSelectedPermissions((prev) => ({
                ...prev,
                [module]: checked ? [...moduleInfo.actions] : [],
            }))
        }
    }

    const handleSave = () => {
        const permissions = allModules
            .filter((module) => selectedPermissions[module.module]?.length > 0)
            .map((module) => ({
                id: module.id,
                name: module.name,
                module: module.module,
                actions: selectedPermissions[module.module] || [],
            }))

        onSave({
            ...(formData as Role),
            permissions,
        })
    }

    if (!isOpen) return null

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="flex items-center text-xl font-semibold">
                        <Shield className="mr-2 text-teal-500" size={20} />
                        {role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="overflow-y-auto p-6"
                    style={{ maxHeight: 'calc(90vh - 130px)' }}
                >
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Tên vai trò{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập tên vai trò"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={2}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                placeholder="Nhập mô tả vai trò"
                            ></textarea>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-medium text-gray-700">
                                Phân quyền
                            </h3>
                            <div className="overflow-hidden rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Module
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Xem
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Thêm
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Sửa
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Xóa
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Tất cả
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {allModules.map((module) => {
                                            const modulePermissions =
                                                selectedPermissions[
                                                    module.module
                                                ] || []
                                            const hasAllPermissions =
                                                modulePermissions.length ===
                                                    module.actions.length &&
                                                module.actions.every((action) =>
                                                    modulePermissions.includes(
                                                        action,
                                                    ),
                                                )

                                            return (
                                                <tr key={module.id}>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                        {module.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePermissions.includes(
                                                                'view',
                                                            )}
                                                            onChange={(e) =>
                                                                handlePermissionChange(
                                                                    module.module,
                                                                    'view',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePermissions.includes(
                                                                'create',
                                                            )}
                                                            onChange={(e) =>
                                                                handlePermissionChange(
                                                                    module.module,
                                                                    'create',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePermissions.includes(
                                                                'edit',
                                                            )}
                                                            onChange={(e) =>
                                                                handlePermissionChange(
                                                                    module.module,
                                                                    'edit',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={modulePermissions.includes(
                                                                'delete',
                                                            )}
                                                            onChange={(e) =>
                                                                handlePermissionChange(
                                                                    module.module,
                                                                    'delete',
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                hasAllPermissions
                                                            }
                                                            onChange={(e) =>
                                                                handleSelectAllForModule(
                                                                    module.module,
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                        type="button"
                        onClick={handleSave}
                        className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600"
                    >
                        {role ? 'Cập nhật' : 'Thêm vai trò'}
                    </button>
                </div>
            </div>
        </div>
    )
}
