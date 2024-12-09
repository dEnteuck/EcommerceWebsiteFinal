import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import qrcode from "../../assets/images/qr.jpg";

const CheckoutPopup = ({ open, handleClose, cartItems = [], totalAmount, resetCart }) => {
  const [paymentMethod, setPaymentMethod] = useState("home");
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    apartment: "",
    country: "VN",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [appTransId, setAppTransId] = useState(null);

  const handleSubmitOrder = async () => {
    if (paymentMethod === "online") {
        try {
            const response = await axios.post("http://localhost:4002/payment", {
                customerInfo,
                cartItems,
                totalAmount,
            });

            const { order_url, app_trans_id } = response.data;

            if (order_url && app_trans_id) {
                setAppTransId(app_trans_id); // Lưu app_trans_id
                window.open(order_url, "_blank");

                const isConfirmed = window.confirm(
                    "Bạn đã hoàn tất chuyển khoản? Nhấn OK để kiểm tra trạng thái thanh toán."
                );

                if (isConfirmed) {
                    const statusResponse = await axios.post(
                        `http://localhost:4002/order-status/${app_trans_id}`,
                        {}
                    );

                    const { return_code } = statusResponse.data;

                    if (return_code === 1) {
                        alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
                        resetCart();
                    } else {
                        alert("Thanh toán không thành công. Vui lòng kiểm tra lại thông tin chuyển khoản.");
                    }
                }
            } else {
                alert("Không thể tạo thanh toán online. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán online:", error);
            alert("Đã xảy ra lỗi khi tạo thanh toán online. Vui lòng thử lại.");
        }
    }

    resetForm();
    handleClose();
};

  

  const resetForm = () => {
    setCustomerInfo({
      fullName: "",
      phone: "",
      address: "",
      apartment: "",
      country: "VN",
    });
    setPaymentMethod("home");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" className="checkoutPopup">
      <DialogTitle>Thanh toán đơn hàng</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>Địa chỉ giao hàng</Typography>
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Quốc gia / Vùng</InputLabel>
                <Select
                  value={customerInfo.country}
                  name="country"
                  onChange={handleInputChange}
                >
                  <MenuItem value="VN">Việt Nam</MenuItem>
                  <MenuItem value="US">Mỹ (United States)</MenuItem>
                  <MenuItem value="JP">Nhật Bản</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên và họ"
                required
                name="fullName"
                value={customerInfo.fullName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                required
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ đường phố hoặc hộp thư bưu điện"
                required
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Căn hộ, phòng, đơn vị (tuỳ chọn)"
                name="apartment"
                value={customerInfo.apartment}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider className="spacing" />

        <Typography variant="h6" gutterBottom>Phương thức thanh toán</Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup row value={paymentMethod} onChange={handlePaymentMethodChange}>
            <FormControlLabel value="home" control={<Radio />} label="Thanh toán tại nhà" />
            <FormControlLabel value="online" control={<Radio />} label="Thanh toán online" />
          </RadioGroup>
        </FormControl>

        <Divider className="spacing" />

        <Box className="order-summary">
          <Typography variant="h6" gutterBottom>
            Tóm tắt đơn hàng ({cartItems.length} sản phẩm)
          </Typography>
          {cartItems.map((item) => (
            <Box className="summary-row" key={item.id}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>
                USD {(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Divider className="spacing" />
          <Box className="summary-row">
            <Typography>Tổng cộng</Typography>
            <Typography variant="h6" className="highlight">
              USD {totalAmount}
            </Typography>
          </Box>
        </Box>

        <Button fullWidth variant="contained" color="primary" onClick={handleSubmitOrder}>
          Tiếp tục thanh toán
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPopup;
