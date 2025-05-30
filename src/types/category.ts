export interface Subcategory {
    id: string
    name: string
    slug: string
}

export interface Category {
    _id?: string
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    parent?: string | null
    createdAt?: string
    updatedAt?: string
    color?: string // Trường bổ sung cho UI
    productCount?: number // Trường bổ sung cho UI
    subcategories?: Subcategory[] // Thêm trường subcategories
}

export interface CategoryResponse {
    success: boolean
    data: Category
}

export interface CategoriesResponse {
    success: boolean
    count: number
    data: Category[]
}
