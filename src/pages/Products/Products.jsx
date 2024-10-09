import { useEffect, useState } from "react";
import { firebaseDB } from "../../firebaseInit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useProductContext } from "../../context/productContext";
import AddProduct from "./AddProduct";
import Loader from "../../components/Loader";
import ProductList from "./ProductList";

function Products({ showForm }) {
  const { products, loading, getAllProducts } = useProductContext(); // Load products from context
  const [showModal, setShowModal] = useState(showForm || false); // To show/hide form
  const [selectedProduct, setSelectedProduct] = useState(null); // For editing a product

  // Fetch products on app mount
  useEffect(() => {
    getAllProducts();
    // addDataToCollection();
  }, []);

  const addProduct = async (product) => {
    debugger;
    const docRef = await addDoc(collection(firebaseDB, "products"), product);
    product.id = docRef.id;
    toast.success("Product added successfully.");
    setSelectedProduct(null); // Reset after successful addition
    setShowModal(false); // Hide form
    getAllProducts();
  };

  const updateProduct = async (updatedProduct) => {
    debugger;
    const docRef = doc(firebaseDB, "products", updatedProduct.id);
    await updateDoc(docRef, updatedProduct);
    toast.success("Product updated successfully.");
    setSelectedProduct(null); // Reset after successful update
    setShowModal(false); // Hide form
  };

  const removeProduct = async (id) => {
    debugger;
    const docRef = doc(firebaseDB, "products", id);
    await deleteDoc(docRef);
    toast.success("Product deleted successfully.");
  };

  const editProduct = (id) => {
    debugger;
    const product = products.find((p) => p.id === id);
    setSelectedProduct(product); // Set the product to be edited
    openModal(); // Show form for editing
  };
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null); // Clear selected product after closing modal
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="App_content">
      {showModal ? <>
        <button onClick={openModal}>Add Product</button>

        {/* Trigger the modal conditionally */}
        {showModal && (
          <AddProduct
            product={selectedProduct}
            addProduct={addProduct}
            updateProduct={updateProduct}
            closeModal={closeModal}
          />
        )}
      </> : undefined}
      {console.log("testing")}
      <div>
        <div className="imageList_top">
          <button
            className='add-product-btn' style={showModal ? { background: 'red' } : undefined}
            onClick={() => setShowModal(!showModal)}
          >
            {showModal ? "Cancel" : "Add Product"}
          </button>
        </div>

          <>
            {products && products.length > 0 ? (
             <ProductList products={products}  isDecription={true} removeProduct={removeProduct} editProduct={editProduct}/> 
            ) : (
              <p>No records found.</p>
            )}
          </>
      </div>
    </div>
  );
}

export default Products;
