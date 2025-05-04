import React, { useState, useEffect } from "react";
import {
  productCategories,
  useProductContext,
} from "../context/productContext";
import styles from "../css/ProductForm.module.css";
import { toast } from "react-toastify";
import Loader from "./Loader";

const initialFormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
};

const ProductForm = ({ editMode = false, productToEdit = null, onSuccess }) => {
  const { addProduct, updateProduct, loading } = useProductContext();
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editMode && productToEdit) {
      setFormData({ ...productToEdit });
    }
  }, [editMode, productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    const { title, price, description, imageUrl, category } = formData;
    if (!title || !price || !description || !imageUrl || !category) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (editMode) {
        await updateProduct(productToEdit.id, formData);
        toast.success("Product updated!");
      } else {
        await addProduct(formData);
        toast.success("Product added!");
      }
      setFormData(initialFormState);
      if (onSuccess) onSuccess(); // e.g. close modal or navigate
    } catch (error) {
      toast.error("Failed to submit product.");
      console.error(error);
    }
  };
  // Display loader while products are fetching
  if (loading) {
    return <Loader />;
  }
  const categories = productCategories;
  return (
    <div className={styles.formContainer}>
      <h2>{editMode ? "Update Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        {categories && Object.keys(categories).length > 0 ? (
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {Object.entries(categories).map(([label, value]) => (
              <option key={value} value={value}>
                {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="category"
            placeholder="Category (e.g., electronics)"
            value={formData.category}
            onChange={handleChange}
          />
        )}

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <button type="submit">
          {editMode ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
