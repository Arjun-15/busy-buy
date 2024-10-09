import React, { useEffect, useState } from "react";
import styles from "../css/Home.module.css";
import { useProductContext } from "../context/productContext";
import Loader from "../components/Loader";
import FilterSidebar from "../components/FilterSidebar";
import ProductList from "./Products/ProductList";
// import { getAuth } from "firebase/auth";
// import { addDataToCollection } from "../../utils/utils";

function Home() {
    const [query, setQuery] = useState("");
    const [priceRange, setPriceRange] = useState(75000);
    const [categories, setCategories] = useState({
        mensFashion: false,
        electronics: false,
        jewelery: false,
        womensClothing: false,
    });

    const {
        products,
        loading,
        getAllProducts,
        filteredProducts,
        filterProducts,
    } = useProductContext();

    // Fetch products on app mount
    useEffect(() => {
        getAllProducts();
        // addDataToCollection();
    }, []);

    // Rerender the products if the search or filter parameters change
    useEffect(() => {
        filterProducts({ priceRange, searchQuery: query, categories });
    }, [priceRange, query, categories]);

    // Display loader while products are fetching
    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles.homePageContainer}>
            <FilterSidebar
                setPriceRange={setPriceRange}
                setCategories={setCategories}
                priceRange={priceRange}
            />
            <form className={styles.form}>
                <input
                    type="search"
                    placeholder="Search By Name"
                    className={styles.searchInput}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>
            {products.length ? (
                <ProductList products={products.length ? filteredProducts : null} />
            ) : null}
        </div>
    );
}

export default Home;
