import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { useState, useContext } from 'react'; 
import { FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import { IoCartSharp } from 'react-icons/io5';
import { MyContext } from '../../App';
import QuantityBox from '../QuantityBox';
import ProductZoom from '../ProductZoom';

const ProductModal = ({ selectedProduct }) => {
    const context = useContext(MyContext);
    const [quantity, setQuantity] = useState(1); // Trạng thái số lượng mặc định là 1

    // Không render nếu không có sản phẩm
    if (!selectedProduct) {
        return null;
    }

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1)); // Không cho giảm dưới 1

    return (
        <Dialog
            open={true}
            className="productModal"
            onClose={() => context.setisOpenProductModal(false)}
        >
            {/* Nút đóng */}
            <Button className="close_" onClick={() => context.setisOpenProductModal(false)}>
                <MdClose />
            </Button>

            {/* Tiêu đề sản phẩm */}
            <h4 className="mb-1 font-weight-bold">{selectedProduct.name}</h4>

            {/* Thông tin thương hiệu và đánh giá */}
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center mr-4">
                    <span>Brand:</span>
                    <span className="ml-2"><b>{selectedProduct.brand}</b></span>
                </div>
                <Rating
                    name="read-only"
                    value={selectedProduct.rating || 0}
                    size="small"
                    precision={0.5}
                    readOnly
                />
            </div>

            <hr />

            {/* Chi tiết sản phẩm */}
            <div className="row mt-2 productDetailsModal">
                {/* Hình ảnh sản phẩm */}
                <div className="col-md-5">
                    <ProductZoom images={selectedProduct.images} />
                </div>

                {/* Thông tin thêm */}
                <div className="col-md-7">
                    <div className="d-flex info align-items-center mb-4">
                        <span className="oldPrice lg mr-2">
                            ${selectedProduct.oldPrice.toFixed(2)}
                        </span>
                        <span className="netPrice text-danger lg">
                            ${selectedProduct.price.toFixed(2)}
                        </span>
                    </div>
                    <span
                        className={`badge ${
                            selectedProduct.countInStock > 0 ? "bg-success" : "bg-danger"
                        }`}
                    >
                        {selectedProduct.countInStock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </span>

                    <p className="mt-3">{selectedProduct.description}</p>

                    {/* Hộp số lượng và nút thêm vào giỏ hàng */}
                    <div className="d-flex align-items-center">
                        {/* <QuantityBox
                            quantity={quantity} // Truyền giá trị số lượng
                            onIncrease={handleIncrease} // Truyền hàm tăng số lượng
                            onDecrease={handleDecrease} // Truyền hàm giảm số lượng
                        /> */}
                        <Button
                            className="btn-blue btn-lg btn-big btn-round ml-3"
                            onClick={() => {
                                context.addToCart({ ...selectedProduct, quantity }); // Thêm sản phẩm vào giỏ hàng
                                context.setisOpenProductModal(false); // Tắt modal
                            }}
                        >
                            <IoCartSharp /> Add to Cart
                        </Button>
                    </div>

                    {/* Nút wishlist và compare */}
                    <div className="d-flex align-items-center mt-5 actions">
                        <Button className="btn-round btn-sml" variant="outlined">
                            <FaHeart /> &nbsp; ADD TO WISHLIST
                        </Button>

                        <Button className="btn-round btn-sml ml-3" variant="outlined">
                            <MdOutlineCompareArrows /> &nbsp; COMPARE
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModal;
