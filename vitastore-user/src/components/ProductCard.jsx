import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card-media">
        <img src={product.image} alt={product.name} />
        <span className="product-pill">{product.tag}</span>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.rating}</span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-card-footer">
          <div>
            <strong>{product.price}</strong>
            <small>{product.size}</small>
          </div>

          <Link to={`/product/${product.id}`}>Xem chi tiết</Link>
        </div>
      </div>
    </article>
  );
}
