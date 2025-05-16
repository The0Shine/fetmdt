import type React from 'react'

import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import {
    Search,
    Filter,
    Calendar,
    Eye,
    Download,
    MoreVertical,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
    id: number
    orderNumber: string
    date: string
    customer: string
    total: number
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    paymentStatus: 'paid' | 'unpaid'
}

// Dữ liệu mẫu
const initialOrders: Order[] = [
    {
        id: 1,
        orderNumber: 'ORD-001',
        date: '17/04/2023 14:30',
        customer: 'Nguyễn Văn A',
        total: 1250000,
        status: 'completed',
        paymentStatus: 'paid',
    },
    {
        id: 2,
        orderNumber: 'ORD-002',
        date: '18/04/2023 09:15',
        customer: 'Trần Thị B',
        total: 850000,
        status: 'processing',
        paymentStatus: 'paid',
    },
    {
        id: 3,
        orderNumber: 'ORD-003',
        date: '18/04/2023 16:45',
        customer: 'Lê Văn C',
        total: 2100000,
        status: 'pending',
        paymentStatus: 'unpaid',
    },
    {
        id: 4,
        orderNumber: 'ORD-004',
        date: '19/04/2023 11:20',
        customer: 'Phạm Thị D',
        total: 1500000,
        status: 'cancelled',
        paymentStatus: 'unpaid',
    },
    {
        id: 5,
        orderNumber: 'ORD-005',
        date: '20/04/2023 13:10',
        customer: 'Hoàng Văn E',
        total: 3200000,
        status: 'completed',
        paymentStatus: 'paid',
    },
    {
        id: 6,
        orderNumber: 'ORD-006',
        date: '21/04/2023 10:05',
        customer: 'Ngô Thị F',
        total: 950000,
        status: 'processing',
        paymentStatus: 'paid',
    },
    {
        id: 7,
        orderNumber: 'ORD-007',
        date: '22/04/2023 15:30',
        customer: 'Đỗ Văn G',
        total: 1800000,
        status: 'completed',
        paymentStatus: 'paid',
    },
    {
        id: 8,
        orderNumber: 'ORD-008',
        date: '23/04/2023 09:45',
        customer: 'Lý Thị H',
        total: 2500000,
        status: 'pending',
        paymentStatus: 'unpaid',
    },
    {
        id: 9,
        orderNumber: 'ORD-009',
        date: '24/04/2023 14:20',
        customer: 'Vũ Văn I',
        total: 1100000,
        status: 'processing',
        paymentStatus: 'paid',
    },
    {
        id: 10,
        orderNumber: 'ORD-010',
        date: '25/04/2023 11:15',
        customer: 'Đinh Thị K',
        total: 3500000,
        status: 'completed',
        paymentStatus: 'paid',
    },
]

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPayment, setFilterPayment] = useState('all')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Order[]>([])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Lọc dữ liệu dựa trên trạng thái và tìm kiếm
    const filteredData = useMemo(() => {
        let filtered = [...orders]

        // Lọc theo trạng thái đơn hàng
        if (filterStatus !== 'all') {
            filtered = filtered.filter((order) => order.status === filterStatus)
        }

        // Lọc theo trạng thái thanh toán
        if (filterPayment !== 'all') {
            filtered = filtered.filter(
                (order) => order.paymentStatus === filterPayment,
            )
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(searchLower) ||
                    order.customer.toLowerCase().includes(searchLower) ||
                    order.date.toLowerCase().includes(searchLower),
            )
        }

        return filtered
    }, [orders, filterStatus, filterPayment, searchTerm])

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Mã đơn hàng',
            selector: (row: Order) => row.orderNumber,
            sortable: true,
        },
        {
            name: 'Ngày đặt',
            selector: (row: Order) => row.date,
            sortable: true,
        },
        {
            name: 'Khách hàng',
            selector: (row: Order) => row.customer,
            sortable: true,
        },
        {
            name: 'Tổng tiền',
            selector: (row: Order) => row.total,
            sortable: true,
            cell: (row: Order) => `${row.total.toLocaleString()}đ`,
        },
        {
            name: 'Trạng thái',
            selector: (row: Order) => row.status,
            sortable: true,
            cell: (row: Order) => {
                let statusClass = ''
                let statusText = ''

                switch (row.status) {
                    case 'pending':
                        statusClass = 'bg-yellow-100 text-yellow-600'
                        statusText = 'Chờ xử lý'
                        break
                    case 'processing':
                        statusClass = 'bg-blue-100 text-blue-600'
                        statusText = 'Đang xử lý'
                        break
                    case 'completed':
                        statusClass = 'bg-green-100 text-green-600'
                        statusText = 'Hoàn thành'
                        break
                    case 'cancelled':
                        statusClass = 'bg-red-100 text-red-600'
                        statusText = 'Đã hủy'
                        break
                }

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
            name: 'Thanh toán',
            selector: (row: Order) => row.paymentStatus,
            sortable: true,
            cell: (row: Order) => {
                const statusClass =
                    row.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                const statusText =
                    row.paymentStatus === 'paid'
                        ? 'Đã thanh toán'
                        : 'Chưa thanh toán'

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
            cell: (row: Order) => (
                <div className="flex space-x-2">
                    <Link
                        to={`/admin/orders/${row.id}`}
                        className="cursor-pointer text-teal-500 hover:text-teal-600"
                    >
                        Xem chi tiết
                    </Link>
                    <button
                        className="text-green-500 hover:text-green-700"
                        title="Tải xuống"
                    >
                        <Download size={16} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        title="Thêm"
                    >
                        <MoreVertical size={16} />
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
                    Đơn hàng
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Trang chủ</span>
                    <span className="mx-2">•</span>
                    <span>Đơn hàng</span>
                </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Danh sách đơn hàng</h2>
                    <div className="flex space-x-2">
                        <button className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600">
                            Xuất Excel
                        </button>
                        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            In đơn hàng
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            placeholder="Tìm theo mã đơn/tên khách hàng"
                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
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
                                <option value="pending">Chờ xử lý</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">
                                Thanh toán:
                            </span>
                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none md:w-40"
                                value={filterPayment}
                                onChange={(e) =>
                                    setFilterPayment(e.target.value)
                                }
                            >
                                <option value="all">Tất cả</option>
                                <option value="paid">Đã thanh toán</option>
                                <option value="unpaid">Chưa thanh toán</option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            <Calendar size={16} className="mr-2" />
                            <span>Thời gian</span>
                        </button>
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
                                Không có đơn hàng nào
                            </div>
                        }
                        persistTableHead
                    />
                </div>
            </div>
        </div>
    )
}
