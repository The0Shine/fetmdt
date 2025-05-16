import { useParams } from 'react-router-dom'
import ProductDetail from '../home/product/product-detail'

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    return <ProductDetail productId={Number(id)} />
}

export default ProductDetailPage
