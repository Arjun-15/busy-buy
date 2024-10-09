import { useEffect, useState } from "react";
import ProductInput from "../../components/ProductInput";
import { productCategories } from "../../context/productContext";

function AddProduct({ product, addProduct, updateProduct, closeModal }) {
    const [productData, setProductData] = useState({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (product) {
            setProductData(product); // Populate the form if editing a product
            setIsEdit(true);
        }
    }, [product]);

    const handleInputChange = (key, value) => {
        setProductData({
            ...productData,
            [key]: value,
        });
    };

    const clearForm = () => {
        setProductData({
            title: "",
            description: "",
            price: "",
            imageUrl: "",
            category: "",
        });
        setIsEdit(false);
    };

    const handleAddProduct = () => {
        const newProduct = {
            ...productData,
            createdOn: new Date(),
        };
        addProduct(newProduct);
        clearForm();
        closeModal();
    };

    const handleUpdateProduct = () => {
        const updatedProduct = {
            ...productData,
            updatedOn: new Date(),
        };
        updateProduct(updatedProduct);
        clearForm();
        closeModal();
    };

    return (
        <>
            {/* Modal Overlay */}
            <div className="modal-overlay" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="modal">
                <div className="modal-header">
                    <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>
                    <button className="close-btn" onClick={closeModal}>
                        &times;
                    </button>
                </div>
                <div className="product-form">
                    <form>
                        <ProductInput
                            label="Title"
                            value={productData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Enter product title"
                            required
                        />
                        <ProductInput
                            label="Image URL"
                            value={productData.imageUrl}
                            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                            placeholder="Enter product image URL"
                            required
                        />
                        <div className="product-input">
                            <label>Category</label>
                            <select onChange={(e) => handleInputChange("category", e.target.value)}
                                placeholder="Enter product category"
                                required>
                                {
                                    generateOption(productCategories, productData.category)
                                }
                            </select>
                        </div>
                        <div className="product-input">
                            <label>Description</label>
                            <textarea value={productData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder='Enter product description'
                            ></textarea>
                        </div>

                        <ProductInput
                            label="Price"
                            value={productData.price}
                            details={{ type: 'number', min: 1, max: 1000000 }}
                            onChange={(e) => {
                                if (isNaN(e.target.value))
                                    return;
                                else
                                    handleInputChange("price", (e.target.value))
                            }}
                            placeholder="Enter product price"
                            required
                        />
                        <div className="product-form-actions">
                            <button type="button" onClick={clearForm}>
                                Clear
                            </button>
                            {isEdit ? (
                                <button type="button" onClick={handleUpdateProduct}>
                                    Update Product
                                </button>
                            ) : (
                                <button type="button" onClick={handleAddProduct}>
                                    Add Product
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddProduct;

const generateOption = (options, selectedValue) => {
    return Object.keys(options).map((algoKey) => (
        <option key={algoKey} value={options[algoKey]} selected={selectedValue === options[algoKey]}>
            {options[algoKey]}
        </option>
    ));
};
