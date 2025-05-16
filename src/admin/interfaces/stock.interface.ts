export interface IStockAdjustmentProduct {
    productId: string
    quantity: number
    note?: string
    unit: string
    productName?: string
    costPrice?: number // Added cost price field
}

export interface IStockAdjustment {
    _id?: string
    type: 'import' | 'export' | 'adjustment'
    reason: string
    products: IStockAdjustmentProduct[]
    // Removed status field as it's always completed
    createdBy?: string
    date?: string
    createdAt?: string
    updatedAt?: string
}

export interface StockAdjustmentResponse {
    success: boolean
    data: IStockAdjustment
}

export interface StockAdjustmentsResponse {
    success: boolean
    count: number
    total: number
    pagination: {
        page: number
        limit: number
        totalPages: number
    }
    data: IStockAdjustment[]
}

export interface StockAdjustmentQueryParams {
    page?: number
    limit?: number
    search?: string
    sort?: string
    type?: 'import' | 'export' | 'adjustment'
    // Removed status parameter
    startDate?: string
    endDate?: string
}
