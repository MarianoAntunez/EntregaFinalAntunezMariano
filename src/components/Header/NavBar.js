import React from "react";
import "./NavBar.css";
import Logo from "./logo-1.png";
import CartWidget from "../CartNav/CartWidget";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <div className="NavBar">
      <img className="logo" src={Logo} alt="img" />
      <div className="menuNav">
        <Link to={`/`}>SHOP</Link>
        <span></span>
        <Link to={"/bookmarks"}>FAVORITES</Link>
      </div>
      <CartWidget />
    </div>
  );
};

export default Nav;
