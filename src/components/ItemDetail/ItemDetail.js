import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import Data from "../../Data";
import { CartContext } from "../../context/cartContext";
import Lightbox from "lightbox2";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "lightbox2/dist/js/lightbox.js";
import "lightbox2/dist/css/lightbox.min.css";

import Spinner from "react-bootstrap/Spinner";

const ItemDetail = () => {
  const { id } = useParams();
  const idNumber = parseInt(id, 10);
  const producto = Data.find((item) => item.id === idNumber);

  const { addItem, selectedSize, setSelectedSize } = useContext(CartContext);

  const [count, setCount] = useState(1);
  const localSelectedSize = localStorage.getItem("selectedSize") || null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Lightbox.option({
      albumLabel: "Imagen %1 de %2",
      fadeDuration: 600,
      resizeDuration: 600,
    });
  }, []);

  const addToCart = () => {
    if (localSelectedSize) {
      addItem(producto, count, localSelectedSize);
      toast.success(`Calzado: ${producto.nombre} agregada al carrito`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Por favor, primero selecciona un talle.",
        confirmButtonColor: "#ffa600",
      });
    }
  };

  const handleSizeChange = (size) => {
    localStorage.setItem("selectedSize", size);
    setSelectedSize(size);
  };

  const increment = () => {
    if (count < producto.stock) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (!producto) {
    return <div>Producto no disponible</div>;
  }

  const isIncrementButtonVisible = count < producto.stock;

  return (
    <>
      <article>
        <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="boxDetail animate__animated animate__fadeIn">
                <div className="imgDetail">
                  <a
                    href={producto.img}
                    data-lightbox="product-gallery"
                    data-title={producto.nombre}
                  >
                    <img src={producto.img} alt={producto.nombre} />
                  </a>
                </div>
                <div className="detail">
                  <h1>{producto.nombre}</h1>
                  <p>{producto.desc}</p>

                  <div className="itemTalle">
                    <small>stock: {producto.stock}</small>
                    <div className="radio-input">
                      <label>
                        <input
                          value="value-39"
                          name="value-radio"
                          id="value-39"
                          type="radio"
                          onChange={() => handleSizeChange("39")}
                          checked={localSelectedSize === "39"}
                        ></input>
                        <span>39</span>
                      </label>
                      <label>
                        <input
                          value="value-40"
                          name="value-radio"
                          id="value-40"
                          type="radio"
                          onChange={() => handleSizeChange("40")}
                          checked={localSelectedSize === "40"}
                        ></input>
                        <span>40</span>
                      </label>
                      <label>
                        <input
                          value="value-41"
                          name="value-radio"
                          id="value-41"
                          type="radio"
                          onChange={() => handleSizeChange("41")}
                          checked={localSelectedSize === "41"}
                        ></input>
                        <span>41</span>
                      </label>
                      <label>
                        <input
                          value="value-42"
                          name="value-radio"
                          id="value-42"
                          type="radio"
                          onChange={() => handleSizeChange("42")}
                          checked={localSelectedSize === "42"}
                        ></input>
                        <span>42</span>
                      </label>
                      <span className="selection"></span>
                    </div>
                  </div>
                  <h3>
                    <strong>${producto.precio}</strong>
                  </h3>
                  <div className="boxDetailComandos">
                    <div className="itemCounter">
                      <div onClick={decrement} className="itemM m1">
                        <button>-</button>
                      </div>
                      <div className="itemC">
                        <span>{count}</span>
                      </div>
                      <div
                        onClick={increment}
                        className={`itemM m2 ${
                          isIncrementButtonVisible ? "" : "hidden"
                        }`}
                      >
                        <button>+</button>
                      </div>
                    </div>
                    <button onClick={addToCart} className="CartBtn btn">
                      <span className="IconContainer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 576 512"
                          fill="rgb(17, 17, 17)"
                          className="cart"
                        >
                          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                        </svg>
                      </span>
                      <p className="text">Add to Cart</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default ItemDetail;
