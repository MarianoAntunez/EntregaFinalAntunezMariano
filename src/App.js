import React from "react";
import Nav from "./components/Header/NavBar";
import Bookmarks from "./components/Bookmarks/bookmarks";
import Productos from "./components/Productos/Productos";
import ItemDetail from "./components/ItemDetail/ItemDetail";
import CartContent from "./components/CartContent/cartContent";
import CartProvider from "./context/CartProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDqIRHiDUnRC-8munuefA42YJOcUDuGiBY",
  authDomain: "app-coder-ecomerce.firebaseapp.com",
  projectId: "app-coder-ecomerce",
  storageBucket: "app-coder-ecomerce.appspot.com",
  messagingSenderId: "349354914328",
  appId: "1:349354914328:web:76e96a1446b9c9c6ee896d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App">
          <header>
            <Nav />
          </header>
          <section>
            <Routes>
              <Route path="/" element={<Productos />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/productos/:id" element={<ItemDetail />} />
              <Route path="/cartContent" element={<CartContent />} />
            </Routes>
          </section>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
