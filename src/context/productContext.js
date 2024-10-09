import { collection, getDocs, query } from "firebase/firestore";
import { createContext, useContext, useReducer } from "react";
import { firebaseDB } from "../firebaseInit";

const ProductsContext = createContext();
export const useProductContext = () =>{
    const value = useContext(ProductsContext);
    console.log(value);
    return value;
}

export const ProductsContextProvider = ({ children }) => {
  const initialState = {
    loading: false,
    products: [],
    filteredProducts: [],
    cartProducts: [],
    error: "",
  };

  const [state, dispatch] = useReducer(ProductsReducer, initialState);

  const getAllProducts = async () => {
    try {
      dispatch({ type: TOGGLE_LOADING });
      const productsRef = collection(firebaseDB, "products");
      const productsSnapshot = await getDocs(query(productsRef));

      const productsData = productsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id:doc.id,
      }));
      console.log("product is this.", productsData);  // Instead of productsRef
      dispatch({ type: SET_PRODUCTS, payload: productsData });
    } catch (error) {
      console.log("product is this.", error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  // Function to filter and search products
  const filterProducts = (filterObj) => {
    const {
      searchQuery,
      priceRange,
      categories: { mensFashion, womensFashion, jewelery, electronics },
    } = filterObj;
    let filteredProducts = state.products;
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    if (mensFashion || womensFashion || jewelery || electronics) {
      filteredProducts = filteredProducts.filter((product) => {
        if (mensFashion && product.category === productCategories.MENSCLOTHES) {
          return true;
        }
        if (womensFashion && product.category === productCategories.WOMENCLOTHES) {
          return true;
        }
        if (electronics && product.category === productCategories.ELECTRONICS) {
          return true;
        }
        if (jewelery && product.category === productCategories.JEWELERY) {
          return true;
        }
        return false;
      });
    }
    if (priceRange && priceRange.min && priceRange.max) {
      filteredProducts = filteredProducts.filter((product) => {
        return (
          product.price >= priceRange.min && product.price <= priceRange.max
        );
      });
    }

    dispatch({ type: SET_FILTERED_PRODUCTS, payload: filteredProducts });
  };

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        filteredProducts: state.filteredProducts,
        loading: state.loading,
        getAllProducts,
        filterProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

const ProductsReducer = (state, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        filteredProducts: action.payload,
      };
    case SET_FILTERED_PRODUCTS:
      return {
        ...state,
        filteredProducts: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    case SET_CART_PRODUCTS:
      return {
        ...state,
        cartProducts: action.payload,
      };
    default:
      return state;
  }
};

//constants products related
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_ERROR = "SET_ERROR";
export const TOGGLE_LOADING = "TOGGLE_LOADING";
export const SET_FILTERED_PRODUCTS = "SET_FILTERED_PRODUCTS";
export const SET_CART_PRODUCTS = "SET_CART_PRODUCTS";


export const productCategories = {
    JEWELERY:'jewelery',
    ELECTRONICS:'electronics',
    MENSCLOTHES:'men\'s clothing',
    WOMENCLOTHES:'men\'s clothing',
}