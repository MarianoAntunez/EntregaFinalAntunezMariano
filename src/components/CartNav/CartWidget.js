import React, { useContext } from "react";
import "./CartWidget.css";
import IconCart from "./icon-cart.png";
import { CartContext } from "../../context/cartContext";
import { Link } from "react-router-dom";

const CartWidget = () => {
  const { productQuantity } = useContext(CartContext);
  return (
    <div className="cart">
      <Link to={`/cartContent`}>
        <img src={IconCart} alt="img" />
        <span>{productQuantity}</span>
      </Link>
    </div>
  );
};

export default CartWidget;
