import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Carousel from "../Carousel/carousel";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

const Productos = () => {
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const db = getFirestore();

  const handleScrollToCarousel = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Data"));
        const productsData = querySnapshot.docs.map((doc) => doc.data());
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    fetchData();

    const storedProducts =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];
    setSelectedProducts(storedProducts);
  }, [db]);

  const filtrarPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const mostrarTodosLosProductos = () => {
    setCategoriaSeleccionada(null);
  };

  const handleCheckboxChange = (producto) => {
    const updatedProducts = selectedProducts.includes(producto)
      ? selectedProducts.filter((p) => p.id !== producto.id)
      : [...selectedProducts, producto];

    console.log("Productos seleccionados:", updatedProducts);

    setSelectedProducts(updatedProducts);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedProducts));
  };
  return (
    <div>
      <Carousel
        onScrollToCarousel={handleScrollToCarousel}
        scrollRef={scrollRef}
      />
      <div className="col-sm-12 t1">LIFESTYLE</div>
      <div className="col-sm12">
        <aside>
          <div className="filtrado">
            <p
              id="categoria"
              className={categoriaSeleccionada === null ? "selected" : ""}
              onClick={mostrarTodosLosProductos}
            >
              TODOS
            </p>
            <p
              id="categoria"
              className={categoriaSeleccionada === "URBAN" ? "selected" : ""}
              onClick={() => filtrarPorCategoria("URBAN")}
            >
              URBAN
            </p>
            <p
              id="categoria"
              className={categoriaSeleccionada === "RELAX" ? "selected" : ""}
              onClick={() => filtrarPorCategoria("RELAX")}
            >
              RELAX
            </p>
            <p
              id="categoria"
              className={
                categoriaSeleccionada === "EXCLUSIVE" ? "selected" : ""
              }
              onClick={() => filtrarPorCategoria("EXCLUSIVE")}
            >
              EXCLUSIVE
            </p>
          </div>
        </aside>
      </div>
      <div className="container-fluid cent-cont" ref={scrollRef}>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Cargando catalogo...</span>
            </div>
          </div>
        ) : (
          <div className="row mt-4">
            {products
              .filter(
                (producto) =>
                  !categoriaSeleccionada ||
                  producto.categoria === categoriaSeleccionada
              )
              .map((producto, index) => (
                <div className="col-sm-4" key={index}>
                  <div className="box" key={producto.id}>
                    <div className="text-center">
                      <img src={producto.img} alt={producto.nombre} />
                    </div>
                    <div className="dataBox">
                      <div className="d-flex align-items-center justify-content-between">
                        <h4>{producto.nombre}</h4>
                        <label className="contCheck">
                          <input
                            type="checkbox"
                            checked={selectedProducts.some(
                              (p) => p.id === producto.id
                            )}
                            onChange={() => handleCheckboxChange(producto)}
                          />
                          <svg
                            height="24px"
                            id="Layer_1"
                            version="1.2"
                            viewBox="0 0 24 24"
                            width="24px"
                            xmlSpace="preserve"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <g>
                              <g>
                                <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521 c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506 c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625 c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191 s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586 s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
                              </g>
                            </g>
                          </svg>
                        </label>
                      </div>
                      <p className="price">${producto.precio}</p>
                    </div>
                    <div className="comandos">
                      <button
                        className="btn"
                        onClick={() =>
                          Swal.fire({
                            icon: "warning",
                            title: "Primero debes seleccionar un talle!",
                            confirmButtonColor: "#ffa600",
                          })
                        }
                      >
                        Add to Cart
                      </button>
                      <Link className="btn" to={`/productos/${producto.id}`}>
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
