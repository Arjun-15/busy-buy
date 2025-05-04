// pages/Cart.js
import React from "react";
import Loader from "../components/Loader";
import ProductList from "./Products/ProductList";
import styles from "../css/Cart.module.css";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/cartContext";

const Cart = () => {
  const {
    cartProducts,
    cartProductsMap,
    loading,
    purchasing,
    removeProductFromCart,
    updateProductQuantity,
    purchaseProducts,
  } = useCartContext();

  const navigate = useNavigate();

  const totalPrice = cartProducts.reduce((acc, curr) => {
    return acc + curr.price * curr.quantity;
  }, 0);

  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {!!cartProducts.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹{totalPrice}/-</p>
          <button
            className={styles.purchaseBtn}
            onClick={() => purchaseProducts(navigate)}
          >
            {purchasing ? "Purchasing..." : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts.length ? (
        <ProductList
          products={cartProducts}
          removeProductFromCart={removeProductFromCart}
          updateProductQuantity={updateProductQuantity}
          onCart
        />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default Cart;
