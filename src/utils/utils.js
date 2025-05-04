// import data from "./data";
import {
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  collection,
  getDoc,
} from "firebase/firestore";
import { firebaseDB } from "../firebaseInit";

// Add data to the products collection only for one time so that they can be used again.
// const addDataToCollection = async () => {
//   try {
//     const batch = writeBatch(firebaseDB);
//     data.forEach((product) => {
//       const docRef = doc(firebaseDB, "products", product.id.toString());
//       batch.set(docRef, product);
//     });

//     await batch.commit();
//   } catch (error) {
//     console.log(error);
//   }
// };

// Fetch products from firestore based on their ids
const getProductsUsingProductIds = async (cart) => {
  const productIds = Object.keys(cart).map(String);
  if (!productIds.length) {
    return false;
  }

  const productsRef = collection(firebaseDB, "products");

  const productsSnapshot = await getDocs(
    query(productsRef, where("id", "in", productIds))
  );

  let productsData = productsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    date: cart?.date,
    id: doc.id,
    quantity: cart[doc.id],
  }));
  if (!productsData || productsData.length === 0) {
    const products = await getDocs(productsRef);
    productsData = products.docs
    .filter((doc) => productIds.includes(doc.id)) // Filter only products with matching IDs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: cart?.date,  // Add date if available in cart
      quantity: cart[doc.id],  // Map quantity from cart for the product
    }));
  }
  console.log(productsData)
  return productsData;
};

// Fetch users cart products from firestore
const getUserCartProducts = async (uid) => {
  const docRef = doc(firebaseDB, "usersCarts", uid);
  const docSnap = await getDoc(docRef);
  return { docRef, data: { ...docSnap.data(), id: docSnap.id } };
};

// Simple function to format date
const convertDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};
const isNullOrEmpty = (str) => {
  return str === undefined && str === null
}
const IsValidNumber = (str, min, max) => {
  const val = parseInt(str);
  if (isNaN(val)) return 0;

  if (!isNullOrEmpty(min) && val < min) return min;
  if (!isNullOrEmpty(max) && val > max) return max;

  return val;
}
export {
  // addDataToCollection,
  IsValidNumber,
  getProductsUsingProductIds,
  getUserCartProducts,
  convertDate,
  isNullOrEmpty
};
