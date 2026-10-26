
function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  
  error,
  className = "",
  
  required = false,}) 
  {

    console.log("from ", options);
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label fw-semibold">
          {label}
          {required && (
            <span className="text-danger ms-1">*</span>
          )}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`form-select ${error ? "is-invalid" : ""} ${className}`.trim()}
       
        required={required}
      >
        {/* <option value="">{placeholder}</option> */}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled || false}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}

export default FormSelect;
