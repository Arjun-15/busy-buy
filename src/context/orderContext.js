// context/ordersContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { firebaseDB } from "../firebaseInit";
import { getDoc, doc } from "firebase/firestore";
import { getProductsUsingProductIds } from "../utils/utils";
import { toast } from "react-toastify";
import { useAuthContext } from "./authContext";

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// Reducer
const ordersReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ORDERS":
      return { ...state, loading: false, orders: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      dispatch({ type: "LOADING" });

      try {
        const docRef = doc(firebaseDB, "userOrders", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (!data || !data.orders?.length) {
          toast.error("No Orders Found!");
          dispatch({ type: "SET_ORDERS", payload: [] });
          return;
        }

        const promiseArray = data.orders.map(
          (order) =>
            new Promise((resolve, reject) => {
              const data = getProductsUsingProductIds(order);
              if (data) resolve(data);
              else reject("Something went wrong");
            })
        );

        const finalOrders = await Promise.all(promiseArray);
        dispatch({ type: "SET_ORDERS", payload: finalOrders });
      } catch (error) {
        dispatch({ type: "ERROR", payload: error.message || "Unknown error" });
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <OrdersContext.Provider value={{ ...state }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => useContext(OrdersContext);
