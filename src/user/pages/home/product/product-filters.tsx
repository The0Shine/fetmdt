'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, Check } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../../../components/ui/popover'
import { Slider } from '../../../../components/ui/slider'
import { cn } from '../../../../lib/utils'
import { formatCurrency } from '../../../../utils/Format'

interface ProductFiltersProps {
    searchTerm?: string
    onSearchChange?: (value: string) => void
    priceRange?: [number, number]
    onPriceRangeChange?: (range: [number, number]) => void
    onlyInStock?: boolean
    onInStockChange?: (value: boolean) => void
    sortBy?: string
    onSortChange?: (value: string) => void
    onFilterApply?: () => void
    onFilterReset?: () => void
    // Compatibility props
    sortOption?: string
    onPriceChange?: (range: [number, number]) => void
    className?: string
}

const MAX_PRICE = 100000000
const PRICE_STEP = 500000 // 500,000 VND step

const sortOptions = [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
]

const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchTerm = '',
    onSearchChange = () => {},
    priceRange = [0, MAX_PRICE],
    onPriceRangeChange = () => {},
    onlyInStock = false,
    onInStockChange = () => {},
    sortBy = 'featured',
    onSortChange = () => {},
    onFilterApply = () => {},
    onFilterReset = () => {},
    // Compatibility props
    sortOption,
    onPriceChange,
    className,
}) => {
    // Local state for search input
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
    const [localPriceRange, setLocalPriceRange] =
        useState<[number, number]>(priceRange)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Use the appropriate sort option
    const effectiveSortBy = sortOption || sortBy

    // Update local search term when prop changes
    useEffect(() => {
        setLocalSearchTerm(searchTerm)
    }, [searchTerm])

    // Update local price range when prop changes
    useEffect(() => {
        setLocalPriceRange(priceRange)
    }, [priceRange])

    // Handle search submit on Enter key or button click
    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (localSearchTerm !== searchTerm) {
            onSearchChange(localSearchTerm)
        }
    }

    // Handle price input change
    const handlePriceInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: 0 | 1,
    ) => {
        const value = Number.parseInt(e.target.value) || 0
        const newRange = [...localPriceRange] as [number, number]
        newRange[index] = value
        setLocalPriceRange(newRange)
    }

    // Handle price slider change
    const handlePriceSliderChange = (values: number[]) => {
        setLocalPriceRange([values[0], values[1]])
    }

    // Apply price filter
    const applyPriceFilter = () => {
        // Ensure min <= max
        const validRange: [number, number] = [
            Math.min(localPriceRange[0], localPriceRange[1]),
            Math.max(localPriceRange[0], localPriceRange[1]),
        ]

        if (onPriceRangeChange) onPriceRangeChange(validRange)
        if (onPriceChange) onPriceChange(validRange)
    }

    // Get current sort option label
    const getCurrentSortLabel = () => {
        return (
            sortOptions.find((option) => option.value === effectiveSortBy)
                ?.label || 'Sắp xếp'
        )
    }

    // Reset all filters
    const handleReset = () => {
        setLocalSearchTerm('')
        setLocalPriceRange([0, MAX_PRICE])
        onFilterReset()
    }

    return (
        <div
            className={cn(
                'mb-6 rounded-lg border border-gray-200 bg-white p-4',
                className,
            )}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <div className="flex">
                        <div className="relative flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={localSearchTerm}
                                onChange={(e) =>
                                    setLocalSearchTerm(e.target.value)
                                }
                                className="w-full rounded-l-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <Button type="submit" className="rounded-l-none">
                            Tìm
                        </Button>
                    </div>
                </form>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                    {/* Sort Dropdown */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="min-w-[140px] justify-between"
                            >
                                <span>{getCurrentSortLabel()}</span>
                                <SlidersHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="end">
                            <div className="p-2">
                                <h3 className="mb-2 font-medium">
                                    Sắp xếp theo
                                </h3>
                                <div className="space-y-1">
                                    {sortOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                'flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-gray-100',
                                                effectiveSortBy ===
                                                    option.value &&
                                                    'bg-blue-50 text-blue-600',
                                            )}
                                            onClick={() =>
                                                onSortChange(option.value)
                                            }
                                        >
                                            {effectiveSortBy ===
                                                option.value && (
                                                <Check className="mr-2 h-4 w-4" />
                                            )}
                                            <span
                                                className={
                                                    effectiveSortBy ===
                                                    option.value
                                                        ? 'ml-6'
                                                        : 'ml-0'
                                                }
                                            >
                                                {option.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Price Filter */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'min-w-[100px]',
                                    (priceRange[0] > 0 ||
                                        priceRange[1] < MAX_PRICE) &&
                                        'bg-blue-50 text-blue-600',
                                )}
                            >
                                Giá
                                {(priceRange[0] > 0 ||
                                    priceRange[1] < MAX_PRICE) && (
                                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium">
                                        ✓
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-4" align="end">
                            <h3 className="mb-3 font-medium">Khoảng giá</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="Từ"
                                        value={localPriceRange[0]}
                                        onChange={(e) =>
                                            handlePriceInputChange(e, 0)
                                        }
                                        step={PRICE_STEP}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        placeholder="Đến"
                                        value={localPriceRange[1]}
                                        onChange={(e) =>
                                            handlePriceInputChange(e, 1)
                                        }
                                        step={PRICE_STEP}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <Slider
                                    defaultValue={[
                                        localPriceRange[0],
                                        localPriceRange[1],
                                    ]}
                                    value={[
                                        localPriceRange[0],
                                        localPriceRange[1],
                                    ]}
                                    min={0}
                                    max={MAX_PRICE}
                                    step={PRICE_STEP}
                                    onValueChange={handlePriceSliderChange}
                                    className="py-4"
                                />

                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>
                                        {formatCurrency(localPriceRange[0])}
                                    </span>
                                    <span>
                                        {formatCurrency(localPriceRange[1])}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                            setLocalPriceRange([0, MAX_PRICE])
                                        }
                                    >
                                        Đặt lại
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={applyPriceFilter}
                                    >
                                        Áp dụng
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Stock Filter */}
                    {/* <Button
                        variant={onlyInStock ? 'default' : 'outline'}
                        className="min-w-[120px]"
                        onClick={() => onInStockChange(!onlyInStock)}
                    >
                        {onlyInStock ? 'Còn hàng ✓' : 'Còn hàng'}
                    </Button> */}

                    {/* Reset Button - Only show if filters are applied */}
                    {(searchTerm ||
                        priceRange[0] > 0 ||
                        priceRange[1] < MAX_PRICE ||
                        onlyInStock) && (
                        <Button
                            variant="ghost"
                            onClick={handleReset}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Đặt lại
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm ||
                priceRange[0] > 0 ||
                priceRange[1] < MAX_PRICE ||
                onlyInStock) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-sm text-gray-500">
                    <span>Bộ lọc:</span>
                    {searchTerm && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                            Tìm kiếm: {searchTerm}
                        </span>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                            Giá: {formatCurrency(priceRange[0])} -{' '}
                            {formatCurrency(priceRange[1])}
                        </span>
                    )}
                    {onlyInStock && (
                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                            Chỉ sản phẩm còn hàng
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductFilters
