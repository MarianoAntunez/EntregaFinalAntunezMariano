import React, { useEffect, useState } from "react";
import { CartContext } from "./cartContext";

const CartProvider = ({ children }) => {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

  const [products, setProducts] = useState(storedCart);
  const [productQuantity, setProductQuantity] = useState(
    storedCart.reduce((acc, product) => acc + product.quantity, 0)
  );
  const [selectedSize, setSelectedSize] = useState(null);

  const addItem = (product, quantity, size) => {
    const existingProduct = products.find(
      (item) => item.id === product.id && item.size === size
      
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
      setProducts([...products]);
    } else {
      setProducts([
        ...products,
        {
          ...product,
          quantity,
          size,
        },
      ]);
    }

    setSelectedSize(size);
  };

  const removeItem = (productId, size) => {
    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) => product.id !== productId || product.size !== size
      )
    );
  };

  const clearCart = () => {
    setProducts([]);
    setSelectedSize(null);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(products));
    setProductQuantity(
      products.reduce((acc, product) => acc + product.quantity, 0)
    );
  }, [products]);

  return (
    <CartContext.Provider
      value={{
        products,
        addItem,
        removeItem,
        clearCart,
        productQuantity,
        selectedSize,
        setSelectedSize,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
