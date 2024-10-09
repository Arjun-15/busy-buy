function ProductInput({ label, value, onChange, placeholder, required = false }) {
    return (
        <div className="product-input">
            <label>{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export default ProductInput;
