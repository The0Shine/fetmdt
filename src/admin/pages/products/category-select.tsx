import type React from 'react'

interface CategorySelectProps {
    id: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    required?: boolean
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    id,
    name,
    value,
    onChange,
    required,
}) => {
    // Danh sách danh mục sản phẩm
    const categories = [
        'Đồ đông lạnh',
        'Rau-củ-quả',
        'Thịt - Hải sản',
        'Trái cây',
        'Đồ uống',
        'Bánh kẹo',
        'Gia vị',
        'Đồ khô',
        'Đồ gia dụng',
        'Khác',
    ]

    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    )
}

export default CategorySelect
