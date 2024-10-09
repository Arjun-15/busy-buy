import { productCategories } from "../context/productContext";

const data = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
      description: "Description for Product 1",
      category: productCategories.ELECTRONICS,
    },
    {
      id: 2,
      name: "Product 2",
      price: 39.99,
      description: "Description for Product 2",
      category: productCategories.JEWELERY,
    },
    // Add more product objects as needed
  ];
  
  export default data;
  