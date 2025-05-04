// import { collection, getDocs, query } from "firebase/firestore";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { createContext, useContext, useReducer } from "react";
import { firebaseDB } from "../firebaseInit";
import { IsValidNumber } from "../utils/utils";
import { toast } from "react-toastify";

const ProductsContext = createContext();
export const useProductContext = () => {
  const value = useContext(ProductsContext);
  // console.log(value);
  return value;
};

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
        id: doc.id,
      }));
      // console.log("product is this.", productsData);  // Instead of productsRef
      dispatch({ type: SET_PRODUCTS, payload: productsData });
    } catch (error) {
      console.log("product is this.", error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };
  // Add product to Firestore and local state
  const addProduct = async (productData) => {
    try {
      dispatch({ type: TOGGLE_LOADING });
      const productRef = collection(firebaseDB, "products");
      const docRef = await addDoc(productRef, productData);
      const newProduct = { ...productData, id: docRef.id };
      dispatch({ type: ADD_PRODUCT, payload: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    }
  };

  // Update product in Firestore and local state
  const updateProduct = async (productId, updatedData) => {
    try {
      const productDoc = doc(firebaseDB, "products", productId);
      await updateDoc(productDoc, updatedData);
      dispatch({ type: UPDATE_PRODUCT, payload: { productId, updatedData } });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  // Function to filter and search products
  const filterProducts = (filterObj) => {
    const {
      searchQuery,
      priceRange,
      categories: { mensFashion, womensFashion, jewelery, electronics },
    } = filterObj;

    let filteredProducts = [...state.products];

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (mensFashion || womensFashion || jewelery || electronics) {
      filteredProducts = filteredProducts.filter((product) => {
        const category = product.category;
        return (
          (mensFashion && category === productCategories.MENSCLOTHES) ||
          (womensFashion && category === productCategories.WOMENCLOTHES) ||
          (jewelery && category === productCategories.JEWELERY) ||
          (electronics && category === productCategories.ELECTRONICS)
        );
      });
    }

    if (
      priceRange &&
      priceRange.min != null &&
      priceRange.max != null &&
      !isNaN(priceRange.min) &&
      !isNaN(priceRange.max)
    ) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = IsValidNumber(product.price);
        return price >= priceRange.min && price <= priceRange.max;
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
        addProduct,
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
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        filteredProducts: [...state.filteredProducts, action.payload],
        loading: false,
      };

    case UPDATE_PRODUCT:
      const updatedProducts = state.products.map((product) =>
        product.id === action.payload.productId
          ? { ...product, ...action.payload.updatedData }
          : product
      );
      return {
        ...state,
        products: updatedProducts,
        filteredProducts: updatedProducts,
        loading: false,
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
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const productCategories = {
  JEWELERY: "jewelery",
  ELECTRONICS: "electronics",
  MENSCLOTHES: "men's clothing",
  WOMENCLOTHES: "women's clothing",
};
