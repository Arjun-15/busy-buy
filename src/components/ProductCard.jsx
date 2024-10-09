import React from "react";
import styles from '../css/Product.module.css'
import ProductDetails from "./ProductDetails";

// Product Card component
const ProductCard = ({
    product: { title, price, imageUrl, id, quantity, description },
    onOwnPage,
    onCart,
    removeProductFromCart,
    updateProductQuantity,
    filterProductFromState,
    isDecription,
}) => {
    return (
        <div className={styles.productContainer}>
            <div className={styles.imageContainer}>
                <img
                    src={imageUrl}
                    alt="Product"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                />
            </div>
            <ProductDetails
                title={title}
                price={price}
                onOwnPage={onOwnPage}
                productId={id}
                description={description}
                onCart={onCart}
                quantity={quantity}
                removeProductFromCart={removeProductFromCart}
                updateProductQuantity={updateProductQuantity}
                filterProductFromState={filterProductFromState}
                isDecription={isDecription}
            />
        </div>
    );
};

export default ProductCard;
