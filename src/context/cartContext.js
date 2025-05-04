// context/cartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { firebaseDB } from "../firebaseInit";
import { getProductsUsingProductIds, getUserCartProducts } from "../utils/utils";
import { toast } from "react-toastify";
import { useAuthContext } from "./authContext";

const CartContext = createContext();

const initialState = {
  cartProducts: [],
  cartProductsMap: {},
  loading: false,
  purchasing: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PURCHASING":
      return { ...state, purchasing: action.payload };
    case "SET_CART":
      return {
        ...state,
        cartProducts: action.payload.products,
        cartProductsMap: action.payload.map,
      };
    case "REMOVE_PRODUCT":
      const newMap = { ...state.cartProductsMap };
      delete newMap[action.payload];
      return {
        ...state,
        cartProducts: state.cartProducts.filter((p) => p.id !== action.payload),
        cartProductsMap: newMap,
      };
    case "UPDATE_QUANTITY":
      const { type, id } = action.payload;
      const updatedProducts = state.cartProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + (type === "add" ? 1 : -1) }
          : product
      );
      return {
        ...state,
        cartProducts: updatedProducts,
        cartProductsMap: {
          ...state.cartProductsMap,
          [id]: state.cartProductsMap[id] + (type === "add" ? 1 : -1),
        },
      };
    case "CLEAR_CART":
      return { ...state, cartProducts: [], cartProductsMap: {} };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuthContext();

  // Fetch Cart
  const getCartProducts = async () => {
    if (!user) return;
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const { data } = await getUserCartProducts(user.uid);
      const { myCart: cart } = data;

      const productsData = await getProductsUsingProductIds(cart);

      if (!productsData || productsData.length === 0) {
        toast.error("No products in Cart!");
        return;
      }

      dispatch({
        type: "SET_CART",
        payload: {
          products: productsData,
          map: cart,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeProductFromCart = async (productId) => {
    try {
      const { data, docRef } = await getUserCartProducts(user.uid);
      const { myCart: cart } = data;

      if (!cart[productId]) {
        return toast.error("Product not in cart!");
      }

      delete cart[productId];
      await updateDoc(docRef, { myCart: cart });

      dispatch({ type: "REMOVE_PRODUCT", payload: productId });
      toast.success("Product Removed Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const updateProductQuantity = (type, id) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { type, id } });
  };

  const purchaseProducts = async (navigate) => {
    dispatch({ type: "SET_PURCHASING", payload: true });

    try {
      const docRef = doc(firebaseDB, "userOrders", user.uid);
      const docSnap = await getDoc(docRef);
      const order = { ...state.cartProductsMap, date: Date.now() };

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          orders: arrayUnion(order),
        });
      } else {
        await setDoc(docRef, {
          orders: [order],
        });
      }

      const userCartRef = doc(firebaseDB, "usersCarts", user.uid);
      await updateDoc(userCartRef, { myCart: {} });

      dispatch({ type: "CLEAR_CART" });
      navigate("/myorders");
    } catch (error) {
      console.error(error);
      toast.error("Purchase failed!");
    } finally {
      dispatch({ type: "SET_PURCHASING", payload: false });
    }
  };

  useEffect(() => {
    getCartProducts();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        getCartProducts,
        removeProductFromCart,
        updateProductQuantity,
        purchaseProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
