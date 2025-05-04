// pages/Orders.js
import React from "react";
import Loader from "../components/Loader";
import styles from "../css/Order.module.css";
import OrderTable from "../components/OrderTable";
import { useOrdersContext } from "../context/orderContext";

const Orders = () => {
  const { orders, loading } = useOrdersContext();

  if (loading) return <Loader />;
  if (!loading && (!orders || !orders.length))
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => (
        <OrderTable order={order} key={idx} />
      ))}
    </div>
  );
};

export default Orders;
