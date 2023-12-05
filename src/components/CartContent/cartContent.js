import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/cartContext";
import "./style.css";
import Swal from "sweetalert2";

const CartContent = () => {
  const { products, removeItem, clearCart } = useContext(CartContext);

  const handleRemoveItem = (productId, size) => {
    removeItem(productId, size);
  };

  // Calcular el total sumando todos los subtotales de los productos
  const total = products.reduce(
    (acc, product) => acc + product.precio * product.quantity,
    0
  );

  // FUNCION PARA VACIAR EL CARRITO CON CONFIRMACIÓN
  const handleVaciarCarrito = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción vaciará tu carrito. ¿Quieres continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffa500",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, vaciar carrito",
      cancelButtonText: "Cancelar",
      iconColor: "#ffa500",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        localStorage.removeItem("cartProducts");
        Swal.fire({
          title: "Carrito vaciado",
          icon: "success",
          confirmButtonColor: "#ffa500",
        });
      }
    });
  };

  // VALIDACION DE INPUTS DATOS PERSONALES
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
    aceptarNotificaciones: false,
  });

  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateFields = () => {
    const isFormValid =
      Object.entries(formData).every(([key, value]) => {
        if (key !== "aceptarNotificaciones") {
          return value && value.trim().length > 0;
        }
        return true;
      }) && formData.aceptarNotificaciones;

    setIsNextButtonDisabled(!isFormValid);
  };

  useEffect(() => {
    validateFields();
  }, [formData]);

  // Validacion de datos envio
  const [envioFormData, setEnvioFormData] = useState({
    provincia: "",
    postalCode: "",
    localidad: "",
    calle: "",
    number: "",
    receiverName: "",
    Dni: "",
  });

  const [isEnvioNextButtonDisabled, setIsEnvioNextButtonDisabled] =
    useState(true);

  const handleEnvioInputChange = (e) => {
    const { name, value } = e.target;

    setEnvioFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleEnvio = () => {
    // Toggle lógico para el input de provincia, si no se requiere.
  };

  const validateEnvioFields = () => {
    const isEnvioFormValid = Object.entries(envioFormData).every(
      ([key, value]) => {
        if (key !== "provincia") {
          return value.trim().length > 0;
        }
        return true;
      }
    );

    setIsEnvioNextButtonDisabled(
      !isEnvioFormValid || Object.keys(envioFormData).length === 0
    );
  };

  useEffect(() => {
    validateEnvioFields();
  }, [envioFormData]);

  // FUNCION DESCUENTO
  const [inputEnabled, setInputEnabled] = useState(false);

  const handleToggle = () => {
    setInputEnabled(!inputEnabled);
  };

  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  useEffect(() => {
    if (inputEnabled && codigoDescuento === "123") {
      const descuento = total * 0.1;
      setDescuentoAplicado(descuento);
    } else {
      setDescuentoAplicado(0);
    }
  }, [inputEnabled, codigoDescuento, total]);

  const handleChangeCodigoDescuento = (e) => {
    const nuevoCodigo = e.target.value;

    setCodigoDescuento(nuevoCodigo);

    if (!inputEnabled) {
      setDescuentoAplicado(0);
    }
  };

  // FUNCION MODAL COMPRA FINAL
  const handleFinalizarCompra = () => {
    const camposPago = document.querySelectorAll("#Pago input[required]");
    let camposCompletos = true;

    document.body.classList.remove("modal-open");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.parentNode.removeChild(modalBackdrop);
    }

    camposPago.forEach((campo) => {
      if (!campo.value.trim()) {
        camposCompletos = false;
      }
    });

    if (!camposCompletos) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos de pago para finalizar la compra.",
        confirmButtonColor: "#ffa500",
      });
      return;
    }

    clearCart();
    localStorage.removeItem("cartProducts");

    const modalPago = document.getElementById("Pago");
    modalPago.classList.remove("show");
    modalPago.setAttribute("aria-hidden", "true");
    modalPago.style.display = "none";

    Swal.fire({
      icon: "success",
      title: "¡Gracias por tu compra!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12 d-flex justify-content-center">
          <div className="boxCart animate__animated animate__fadeIn">
            {products.length === 0 ? (
              <p className="contNull animate__animated animate__flipInX">
                Aún no tienes productos en el carrito.🙁
              </p>
            ) : (
              products.map((product, index) => (
                <div
                  key={index}
                  className="cartDetail animate__animated animate__fadeIn"
                >
                  <img src={product.img} alt={product.nombre} />
                  <div>
                    <p>
                      Nombre <span>{product.nombre}</span>
                    </p>
                    <p>
                      Talle <span>{product.size}</span>
                    </p>
                  </div>
                  <p>
                    Cantidad <span>{product.quantity}</span>
                  </p>
                  <p>
                    Total <span>${product.precio}</span>
                  </p>
                  <p>
                    Subtotal <span>${product.precio * product.quantity}</span>
                  </p>
                  <button
                    className="btnDelete"
                    onClick={() => handleRemoveItem(product.id, product.size)}
                  >
                    <svg viewBox="0 0 448 512" className="svgIcon">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
            {products.length > 0 && (
              <div className="comandosCart animate__animated animate__fadeIn">
                <div className="comandosIzquierda">
                  <p className="btn" onClick={handleVaciarCarrito}>
                    Vaciar Carrito
                  </p>
                </div>
                <div className="comandosDerecha">
                  <p className="d1">Total: ${total}</p>
                  <p
                    data-bs-toggle="modal"
                    data-bs-target="#datosPersonales"
                    className="d2"
                  >
                    Finalizar compra
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE COMPRA */}
      {/* DATOS PERSONALES */}
      <div
        className="modal fade"
        id="datosPersonales"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Datos personales
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="form-1">
                <div className="row">
                  <div className="col-6">
                    <div className="datos1-1">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                        onBlur={validateFields}
                      />
                      <label className="mt-3">Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        required
                        value={formData.apellido}
                        onChange={handleInputChange}
                        onBlur={validateFields}
                      />
                      <label className="mt-3">E-mail</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={validateFields}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="datos1-2">
                      <label htmlFor="phone">Telefono / Movil</label>
                      <input
                        type="tel"
                        id="phone"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleInputChange}
                        onBlur={validateFields}
                      />
                      <label htmlFor="dni" className="mt-3">
                        DNI
                      </label>
                      <input
                        type="tel"
                        id="client-document"
                        name="dni"
                        required
                        value={formData.dni}
                        onChange={handleInputChange}
                        onBlur={validateFields}
                      />
                      <div className="not">
                        <input
                          type="checkbox"
                          id="not"
                          name="aceptarNotificaciones"
                          required
                          checked={formData.aceptarNotificaciones}
                          onChange={handleInputChange}
                          onBlur={validateFields}
                        />
                        <label htmlFor="not">
                          Acepto recibir notificaciones de este sitio.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#Envio"
                disabled={isNextButtonDisabled}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ENVIO */}
      <div
        className="modal fade"
        id="Envio"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Envio
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="form-1" onChange={handleEnvioInputChange}>
                <div className="row">
                  <div className="col-6">
                    <div className="datos1-1">
                      <label htmlFor="provincia">Provincia</label>
                      <select
                        id="provincia"
                        name="provincia"
                        onChange={handleEnvioInputChange}
                        onBlur={validateEnvioFields}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="provincia2">Buenos Aires</option>
                        <option value="provincia3">Tucuman</option>
                        <option value="provincia4">Cordoba</option>
                        <option value="provincia5">Jujuy</option>
                      </select>
                      <label className="mt-3">Codigo postal</label>
                      <input
                        id="ship-postalCode"
                        name="postalCode"
                        type="text"
                        required
                        onChange={handleEnvioInputChange}
                        onBlur={validateEnvioFields}
                      />
                      <label className="mt-3">Localidad</label>
                      <input type="text" name="localidad" required />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="datos1-2">
                      <label>Domicilio</label>
                      <div className="d-flex calle">
                        <label>Calle</label>
                        <input
                          id="ship-street"
                          name="calle"
                          type="text"
                          className="street"
                          required
                          onChange={handleEnvioInputChange}
                          onBlur={validateEnvioFields}
                        />
                        <label>N°</label>
                        <input
                          id="ship-number"
                          name="number"
                          type="text"
                          className="number"
                          required
                          onChange={handleEnvioInputChange}
                          onBlur={validateEnvioFields}
                        />
                      </div>
                      <label className="mt-4">Nombre del que recibe</label>
                      <input
                        id="ship-receiverName"
                        name="receiverName"
                        type="text"
                        required
                        onChange={handleEnvioInputChange}
                        onBlur={validateEnvioFields}
                      />
                      <label className="mi-t">DNI del que recibe</label>
                      <input
                        type="tel"
                        id="client-document"
                        name="Dni"
                        required
                        onChange={handleEnvioInputChange}
                        onBlur={validateEnvioFields}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#datosPersonales"
              >
                Volver
              </button>
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#Pago"
                disabled={isEnvioNextButtonDisabled}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAGO */}
      <div
        className="modal fade"
        id="Pago"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Pago
              </h1>
              <small>&#40;Insertar cualquier digito o dato no real&#41;.</small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="form-1">
                <div className="row">
                  <div className="col-6">
                    <div className="datos1-1">
                      <label>Numero</label>
                      <input type="text" required />
                      <label className="mt-3">
                        Nombre y apellido como figura en la tarjeta
                      </label>
                      <input type="text" required />
                      <label className="mi-t4">Codigo de seguridad</label>
                      <input type="text" required />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="datos1-2">
                      <label>Fecha de vencimiento</label>
                      <div className="d-flex gap-3  ">
                        <select id="mes" name="mes">
                          <option value="01">Enero</option>
                          <option value="02">Febrero</option>
                          <option value="03">Marzo</option>
                        </select>
                        <select id="año" name="año">
                          <option value="2023">2023</option>
                        </select>
                      </div>
                      <label htmlFor="dni" className="mi-t2">
                        DNI del titular de la tarjeta
                      </label>
                      <input type="text" id="dni" required />
                      <div className="checkDesc">
                        <div className="checkbox-apple">
                          <input
                            className="yep"
                            id="check-apple"
                            type="checkbox"
                            onChange={handleToggle}
                          />
                          <label for="check-apple"></label>
                        </div>
                        <label className="mi-t3">Codigo de descuento</label>
                      </div>
                      <input
                        className="inputDesc"
                        type="text"
                        id="myInput"
                        disabled={!inputEnabled}
                        placeholder={inputEnabled ? "si" : "no"}
                        onChange={handleChangeCodigoDescuento}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer mf-Pago">
              <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target="#Envio"
              >
                Volver
              </button>
              <div className="d-flex align-items-center">
                <p>Total a pagar:&nbsp;</p>
                <span className="total-pagar">
                  ${total - descuentoAplicado}
                </span>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    handleFinalizarCompra();
                    // Cierra el modal de Pago después de finalizar la compra
                    document.getElementById("Pago").classList.remove("show");
                    document
                      .getElementById("Pago")
                      .setAttribute("aria-hidden", "true");
                  }}
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
