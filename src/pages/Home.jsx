import React, { useEffect, useState } from "react";
import styles from "../css/Home.module.css";
import { useProductContext } from "../context/productContext";
import Loader from "../components/Loader";
import FilterSidebar from "../components/FilterSidebar";
import ProductList from "./Products/ProductList";

function Home() {
    const [query, setQuery] = useState("");
    const [priceRange, setPriceRange] = useState({min:0,max:75000});
    const [categories, setCategories] = useState({
        mensFashion: false,
        electronics: false,
        jewelery: false,
        womensClothing: false,
    });

    const {
        loading,
        getAllProducts,
        filteredProducts,
        filterProducts,
    } = useProductContext();

    // Fetch products on app mount
    useEffect(() => {
        getAllProducts();
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
            {filteredProducts.length ? (
                <ProductList products={filteredProducts.length ? filteredProducts : null} />
            ) : null}
        </div>
    );
}

export default Home;
