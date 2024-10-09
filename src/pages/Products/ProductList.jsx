import React from "react";
import styles from '../../css/Product.module.css'
import ProductCard from "../../components/ProductCard";

const ProductList = ({
  products,
  style,
  onCart,
  removeProductFromCart,
  updateProductQuantity,
  filterProductFromState,
  isDecription,
}) => {
  // Component to display the product list
  return (
    <div className={styles.grid} style={{ ...style }}>
      {products && products.map((product, idx) => {
        
        return (
          <ProductCard
            product={product}
            key={idx}
            removeProductFromCart={removeProductFromCart}
            updateProductQuantity={updateProductQuantity}
            filterProductFromState={filterProductFromState}
            onCart={onCart}
            isDecription={isDecription}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
