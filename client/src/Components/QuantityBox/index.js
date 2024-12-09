import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import Button from '@mui/material/Button';

const QuantityBox = ({ quantity, onIncrease, onDecrease }) => {
    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={onDecrease} disabled={quantity <= 1}>
                <FaMinus />
            </Button>
            <input type="text" value={quantity} readOnly />
            <Button onClick={onIncrease}>
                <FaPlus />
            </Button>
        </div>
    );
};

export default QuantityBox;
