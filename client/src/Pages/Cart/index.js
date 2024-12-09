import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { IoIosClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { IoCartSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import CheckoutPopup from "../../Pages/Cart/CheckoutPopup"; // Import CheckoutPopup


const Cart = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(MyContext);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Hàm thay đổi số lượng sản phẩm trong giỏ hàng
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Hàm tính tổng giá trị giỏ hàng
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Mở popup khi bấm vào "Proceed to Checkout"
  const handleCheckoutOpen = () => {
    setIsCheckoutOpen(true);
  };

  // Đóng popup
  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd mb-1">Your Cart</h2>
          <p>
            There are <b className="text-red">{cartItems.length}</b> products in
            your cart
          </p>

          <div className="row">
            <div className="col-md-9 pr-5">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="35%">Product</th>
                      <th width="15%">Unit Price</th>
                      <th width="25%">Quantity</th>
                      <th width="15%">Subtotal</th>
                      <th width="10%">Remove</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img
                                src={`http://localhost:4002/uploads/${item.images[0]}`}
                                className="w-100"
                                alt={item.name}
                              />
                            </div>
                            <div className="info px-3">
                              <h6>{item.name}</h6>
                              <Rating
                                className="read-only"
                                value={item.rating || 0}
                                readOnly
                                precision={0.5}
                                size="small"
                              />
                            </div>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                          <QuantityBox
                            quantity={item.quantity}
                            onIncrease={() => handleQuantityChange(item.id, 1)}
                            onDecrease={() => handleQuantityChange(item.id, -1)}
                          />
                        </td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <span
                            className="remove"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <IoIosClose />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border p-3 cartDetails">
                <h4>CART TOTALS</h4>
                <div className="d-flex align-items-center">
                  <b>Free shipping</b>
                </div>
                <div className="d-flex align-items-center">
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">
                    ${calculateTotal()}
                  </span>
                </div>
                <Button
                  className="btn-blue btn-lg btn-big btn-red"
                  onClick={handleCheckoutOpen} // Bấm để mở popup
                >
                  <IoCartSharp /> Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gọi Component Popup */}
      <CheckoutPopup
        open={isCheckoutOpen}
        handleClose={handleCheckoutClose}
        cartItems={cartItems}
        totalAmount={calculateTotal()}
        resetCart={() => setCartItems([])} // Reset giỏ hàng khi thanh toán xong
      />
    </>
  );
};

export default Cart;
