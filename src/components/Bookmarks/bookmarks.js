import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const [bookmarkedProducts, setBookmarkedProducts] = useState([]);

  useEffect(() => {
    const selectedProducts =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];
    setBookmarkedProducts(selectedProducts);
  }, []);

  const handleRemoveBookmark = (productId) => {
    const updatedBookmarks = bookmarkedProducts.filter(
      (producto) => producto.id !== productId
    );

    setBookmarkedProducts(updatedBookmarks);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedBookmarks));
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-center">
            <div className="boxMarks animate__animated animate__fadeIn">
              {bookmarkedProducts.length === 0 ? (
                <p className="animate__animated animate__flipInX">No has marcado ningún producto.</p>
              ) : (
                <div className="animate__animated animate__fadeIn">
                  <h2>Productos favoritos</h2>
                  {bookmarkedProducts.map((producto) => (
                    <div className="contentMarks" key={producto.id}>
                      <img src={producto.img} alt={producto.nombre} />
                      <div className="text-center">
                        <p className="bookProductoNombre">{producto.nombre}</p>
                        <Link to={`/productos/${producto.id}`}>VER</Link>
                      </div>
                      <div className="me-2">
                        <button
                          className="btn"
                          onClick={() => handleRemoveBookmark(producto.id)}
                        >
                          eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
