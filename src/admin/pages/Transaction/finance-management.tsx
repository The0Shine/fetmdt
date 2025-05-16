'use client'

import type React from 'react'
import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { Search, Calendar, Filter, Plus, MoreVertical } from 'lucide-react'

// Định nghĩa kiểu dữ liệu cho giao dịch
interface Transaction {
    id: number
    date: string
    type: string
    source: string
    amount: string
    status: 'income' | 'expense'
}

const Transaction = () => {
    const [activeTab, setActiveTab] = useState('giao-dich')
    const [searchTerm, setSearchTerm] = useState('')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Transaction[]>([])

    // Dữ liệu tĩnh cho các thẻ thống kê
    const statisticsData = [
        {
            id: 1,
            title: 'Đã thu',
            amount: '3,780,000',
            description: '50 bên giao dịch đã thu',
            count: 16,
            type: 'income' as const,
            bgColor: 'bg-amber-50',
            countBgColor: 'bg-amber-500',
        },

        {
            id: 3,
            title: 'Đã chi',
            amount: '3,780,000',
            description: '50 bên giao dịch đã chi',
            count: 3,
            type: 'expense' as const,
            bgColor: 'bg-blue-50',
            countBgColor: 'bg-blue-500',
        },
    ]

    // Dữ liệu tĩnh cho bảng giao dịch
    const transactionData: Transaction[] = [
        {
            id: 1,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 2,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 3,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'expense',
        },
        {
            id: 4,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 5,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 6,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'expense',
        },
        {
            id: 7,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 8,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 9,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Tiền mặt',
            amount: '$ 250,000',
            status: 'income',
        },
        {
            id: 10,
            date: '14:15 - 17/04/2023',
            type: 'Bán hàng',
            source: 'Ví điện tử',
            amount: '$ 12,250,000',
            status: 'expense',
        },
    ]

    // Lọc dữ liệu dựa trên tìm kiếm
    const filteredData = useMemo(() => {
        if (!searchTerm) return transactionData

        return transactionData.filter((item) => {
            const searchLower = searchTerm.toLowerCase()
            return (
                item.type.toLowerCase().includes(searchLower) ||
                item.source.toLowerCase().includes(searchLower) ||
                item.date.toLowerCase().includes(searchLower)
            )
        })
    }, [transactionData, searchTerm])

    // Xử lý tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    // Cấu hình cột cho DataTable
    const columns = [
        {
            name: 'Ngày tạo đơn',
            selector: (row: Transaction) => row.date,
            sortable: true,
        },
        {
            name: 'Phân loại',
            selector: (row: Transaction) => row.type,
            sortable: true,
        },
        {
            name: 'Nguồn tiền',
            selector: (row: Transaction) => row.source,
            sortable: true,
        },
        {
            name: 'Tổng tiền',
            selector: (row: Transaction) => row.amount,
            sortable: true,
        },
        {
            name: 'Trạng thái',
            cell: (row: Transaction) => (
                <span
                    className={`px-3 py-1 ${
                        row.status === 'income'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                    } rounded-full text-xs font-medium`}
                >
                    {row.status === 'income' ? 'Đã thu' : 'Đã chi'}
                </span>
            ),
            sortable: true,
        },
        {
            name: '',
            cell: () => (
                <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={18} />
                </button>
            ),
            width: '50px',
            button: true,
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
        <main className="flex-1 overflow-y-auto">
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Thu chi
                    </h1>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="text-blue-500">Trang chủ</span>
                        <span className="mx-2">•</span>
                        <span>Thu chi</span>
                    </div>
                </div>

                <div className="w-full">
                    <div className="mb-6 border-b">
                        <div className="flex">
                            <button
                                className={`rounded-none border-b-2 px-4 py-2 ${
                                    activeTab === 'giao-dich'
                                        ? 'border-teal-500 text-teal-500'
                                        : 'border-transparent text-gray-500'
                                }`}
                                onClick={() => setActiveTab('giao-dich')}
                            >
                                Giao dịch
                            </button>
                        </div>
                    </div>

                    {activeTab === 'giao-dich' && (
                        <div>
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {statisticsData.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`${item.bgColor} relative overflow-hidden rounded-lg p-4`}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-700">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-2xl font-bold">
                                                    {item.amount}
                                                </p>
                                            </div>
                                            <div
                                                className={`${item.countBgColor} flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white`}
                                            >
                                                {item.count}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-6 rounded-lg bg-white shadow-sm">
                                <div className="border-b p-4">
                                    <h2 className="text-lg font-medium">
                                        Danh sách giao dịch
                                    </h2>
                                </div>

                                <div className="flex items-center justify-between border-b p-4">
                                    <div className="relative w-80">
                                        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
                                            <Search size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Tìm mã đơn/tên khách hàng/SĐT"
                                            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
                                            <Calendar size={16} />
                                            <span>Thời gian</span>
                                        </button>
                                        <button className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
                                            <span>Lọc</span>
                                            <Filter size={16} />
                                        </button>
                                    </div>
                                </div>

                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    pagination
                                    paginationResetDefaultPage={
                                        resetPaginationToggle
                                    }
                                    paginationComponentOptions={
                                        paginationComponentOptions
                                    }
                                    selectableRows
                                    onSelectedRowsChange={(state) =>
                                        setSelectedRows(state.selectedRows)
                                    }
                                    customStyles={customStyles}
                                    noDataComponent={
                                        <div className="p-4 text-center text-gray-500">
                                            Không có giao dịch nào
                                        </div>
                                    }
                                    persistTableHead
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'thu-chi' && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium">Thu chi</h2>
                            <p className="text-gray-500">
                                Nội dung thu chi sẽ hiển thị ở đây
                            </p>
                        </div>
                    )}

                    {activeTab === 'so-no' && (
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-medium">Sổ nợ</h2>
                            <p className="text-gray-500">
                                Nội dung sổ nợ sẽ hiển thị ở đây
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed right-6 bottom-6">
                <button className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg hover:bg-teal-600">
                    <Plus size={20} />
                </button>
            </div>
        </main>
    )
}

export default Transaction
