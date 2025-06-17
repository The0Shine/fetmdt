'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Grid3X3, Tag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { ICategory } from '../../../types/category'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { getSubcategories } from '../../../services/apiCategory.service'

interface CategorySidebarProps {
    selectedCategory?: string
    categories: ICategory[]
    activeCategory?: string
    loading?: boolean
    onCategorySelect?: (categoryId: string, categorySlug?: string) => void
}

export default function CategorySidebar({
    selectedCategory,
    categories,
    activeCategory,
    loading = false,
    onCategorySelect,
}: CategorySidebarProps) {
    const location = useLocation()
    const [expandedCategories, setExpandedCategories] = useState<string[]>([])
    const [parentCategories, setParentCategories] = useState<ICategory[]>([])
    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<string, ICategory[]>
    >({})
    const [loadingSubcategories, setLoadingSubcategories] = useState<
        Record<string, boolean>
    >({})

    // Xử lý dữ liệu categories khi nhận được
    useEffect(() => {
        if (categories.length > 0) {
            // Phân loại categories thành parent và children
            const parents: ICategory[] = []
            const subcatMap: Record<string, ICategory[]> = {}

            categories.forEach((category) => {
                if (!category.parent) {
                    // Đây là danh mục cha
                    parents.push(category)
                } else {
                    // Đây là danh mục con
                    const parentId =
                        typeof category.parent === 'string'
                            ? category.parent
                            : category.parent._id

                    if (!subcatMap[parentId]) {
                        subcatMap[parentId] = []
                    }
                    subcatMap[parentId].push(category)
                }
            })

            setParentCategories(parents)
            setSubcategoriesMap(subcatMap)
        }
    }, [categories])

    // Auto expand category nếu có active category
    useEffect(() => {
        if ((activeCategory || selectedCategory) && categories.length > 0) {
            const currentCategory = activeCategory || selectedCategory

            // Tìm category hiện tại
            const activeCat = categories.find(
                (cat) =>
                    cat._id === currentCategory || cat.slug === currentCategory,
            )

            // Nếu active category là danh mục con, mở rộng danh mục cha
            if (activeCat && activeCat.parent) {
                const parentId =
                    typeof activeCat.parent === 'string'
                        ? activeCat.parent
                        : activeCat.parent._id

                setExpandedCategories((prev) =>
                    prev.includes(parentId) ? prev : [...prev, parentId],
                )
            }
        }
    }, [activeCategory, selectedCategory, categories])

    // Fetch subcategories khi mở rộng danh mục
    const toggleCategory = async (categoryId: string) => {
        // Nếu đã mở rộng, thu gọn lại
        if (expandedCategories.includes(categoryId)) {
            setExpandedCategories((prev) =>
                prev.filter((id) => id !== categoryId),
            )
            return
        }

        // Nếu chưa mở rộng, mở rộng và fetch subcategories nếu cần
        setExpandedCategories((prev) => [...prev, categoryId])

        // Nếu chưa có subcategories cho category này, fetch từ API
        if (
            !subcategoriesMap[categoryId] ||
            subcategoriesMap[categoryId].length === 0
        ) {
            try {
                setLoadingSubcategories((prev) => ({
                    ...prev,
                    [categoryId]: true,
                }))
                const response = await getSubcategories(categoryId)

                if (
                    response?.success &&
                    response.data &&
                    response.data.length > 0
                ) {
                    setSubcategoriesMap((prev) => ({
                        ...prev,
                        [categoryId]: response.data,
                    }))
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error)
            } finally {
                setLoadingSubcategories((prev) => ({
                    ...prev,
                    [categoryId]: false,
                }))
            }
        }
    }

    const handleCategoryClick = (categoryId: string, categorySlug?: string) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId, categorySlug)
        }
    }

    const isActiveCategory = (category: ICategory): boolean => {
        const currentActive = activeCategory || selectedCategory
        return currentActive === category._id || currentActive === category.slug
    }

    const isCurrentPath = (path: string): boolean => {
        return location.pathname === path
    }

    if (loading) {
        return (
            <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-4">
                    <div className="h-6 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded bg-gray-100"
                        ></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-lg border bg-white shadow-sm">
            {/* Header */}
            <div className="border-b p-4">
                <div className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-900">
                        Danh mục sản phẩm
                    </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Lọc sản phẩm theo danh mục
                </p>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* All Products Link */}
                <Link
                    to="/shop"
                    onClick={() => handleCategoryClick('', '')}
                    className={`mb-3 block w-full rounded-lg border p-3 text-left transition-all duration-200 ${
                        isCurrentPath('/shop')
                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span className="font-medium">Tất cả sản phẩm</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            Tất cả
                        </Badge>
                    </div>
                </Link>

                {/* Categories List */}
                {parentCategories.length > 0 ? (
                    <div className="space-y-1">
                        {parentCategories.map((category) => {
                            const isActive = isActiveCategory(category)
                            const isExpanded = expandedCategories.includes(
                                category._id,
                            )
                            const subcategories =
                                subcategoriesMap[category._id] || []
                            const isLoading =
                                loadingSubcategories[category._id] || false

                            return (
                                <div key={category._id} className="space-y-1">
                                    {/* Parent Category */}
                                    <div className="flex items-center gap-1">
                                        <Link
                                            to={`/shop/category/${category.slug}`}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    category._id,
                                                    category.slug,
                                                )
                                            }
                                            className={`flex-1 rounded-lg border p-3 transition-all duration-200 ${
                                                isActive
                                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 flex-shrink-0" />
                                                        <span className="truncate font-medium">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                    {category.description && (
                                                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                                            {
                                                                category.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Expand/Collapse Button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                toggleCategory(category._id)
                                            }
                                            className="h-12 w-8 p-0 text-gray-400 hover:text-gray-600"
                                        >
                                            {isLoading ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                            ) : isExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Subcategories */}
                                    {isExpanded && (
                                        <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                                            {isLoading ? (
                                                <div className="py-2 text-center text-xs text-gray-500">
                                                    Đang tải danh mục con...
                                                </div>
                                            ) : subcategories.length > 0 ? (
                                                subcategories.map(
                                                    (subcategory) => {
                                                        const isSubActive =
                                                            isActiveCategory(
                                                                subcategory,
                                                            )

                                                        return (
                                                            <Link
                                                                key={
                                                                    subcategory._id
                                                                }
                                                                to={`/shop/category/${subcategory.slug}`}
                                                                onClick={() =>
                                                                    handleCategoryClick(
                                                                        subcategory._id,
                                                                        subcategory.slug,
                                                                    )
                                                                }
                                                                className={`block rounded-md border p-2 transition-all duration-200 ${
                                                                    isSubActive
                                                                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                                                                        : 'border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-2 rounded-full bg-current opacity-50"></div>
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            subcategory.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {subcategory.description && (
                                                                    <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                                                                        {
                                                                            subcategory.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </Link>
                                                        )
                                                    },
                                                )
                                            ) : (
                                                <div className="py-2 text-center text-xs text-gray-500">
                                                    Không có danh mục con
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <div className="mb-3 text-gray-400">
                            <Grid3X3 className="mx-auto h-12 w-12" />
                        </div>
                        <p className="text-sm text-gray-500">
                            Chưa có danh mục nào
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
