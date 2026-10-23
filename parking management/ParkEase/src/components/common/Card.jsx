import Button from "./Button";

function Card({title, description,image,icon,children,className="",onclick})
{

  return (
   
    <div className={`card h-100 shadow-sm ${className}`}>
      {image && (<img src={image} alt={title || "Card image"} className="card-img-top" />)}

      <div className="card-body">
        {icon && ( 
          <div className="card-icon mb-3">
            {icon}
          </div>
        )}
        {title && (
          <h5 className="card-title">{title}</h5>
        )}
        {description && (
          <p className="card-text">{description}</p>
        )}

        {children && (
          <div className="card-content">{children}</div>
        )}
        {onclick && (
          <Button type="button" className="btn btn-primary mt-3" onClick={onclick}>View Details</Button>
        )}
      </div>

    </div>
   
  );
}

export default Card;
