import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from '@mui/material/Button';
import { FaRegHeart } from "react-icons/fa";
import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../App';
import axios from 'axios';

const ProductItem = (props) => {
    const [productData, setProductData] = useState([]);
    const context = useContext(MyContext);

    const viewProductDetails = (id) => {
        const selectedProduct = productData.find((product) => product.id === id); // Lấy sản phẩm dựa trên ID
        context.setSelectedProduct(selectedProduct); // Cập nhật sản phẩm được chọn vào context
        context.setisOpenProductModal(true); // Mở modal
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:4002/api/products");
            setProductData(response.data.products); // Giả sử API trả về `products`
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    return (
        <>
            {productData.map((product) => (
                <div key={product.id} className={`productItem ${props.itemView}`}>
                    <div className="imgWrapper">
                        <img
                            src={`http://localhost:4002/uploads/${product.images[0]}`}
                            alt={product.name}
                            className="w-100"
                        />
                        <span className="badge badge-primary">{product.discountPercentage}%</span>
                        <div className="actions">
                            <Button onClick={() => viewProductDetails(product.id)}>
                                <TfiFullscreen />
                            </Button>
                            <Button>
                                <FaRegHeart style={{ fontSize: '20px' }} />
                            </Button>
                        </div>
                    </div>

                    <div className="info">
                        <h4>{product.name}</h4>
                        <span className="text-success d-block">
                            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                        <Rating name="read-only" value={product.rating || 0} readOnly size="small" precision={0.5} />
                        <div className="d-flex">
                            <span className="oldPrice">${product.oldPrice.toFixed(2)}</span>
                            <span className="netPrice text-danger ml-2">${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProductItem;
