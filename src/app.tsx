import React, { useState, useEffect } from "react";

const formatGBP = (amount: number) => `£${amount.toFixed(2)}`;

type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  inStock: boolean;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Angel Tee",
    price: 25.99,
    images: ["/blvd_saint_product_1.png", "/blvd_saint_product_2.png"],
    description: "Premium cotton tee with Angel graphic.",
    stock: 1,
    inStock: true
  },
  {
    id: 2,
    name: "Where Is My Mind Hoodie",
    price: 59.99,
    images: ["/blvd_saint_product_3.png", "/blvd_saint_product_4.png"],
    description: "Heavyweight premium hoodie.",
    stock: 1,
    inStock: true
  },
  {
    id: 3,
    name: "Duck Tee",
    price: 25.99,
    images: ["/blvd_saint_product_5.png", "/blvd_saint_product_6.png"],
    description: "Soft cotton tee.",
    stock: 1,
    inStock: true
  }
];

export default function App() {
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  useEffect(() => {
    setActiveImage(0);
  }, [selectedProductId]);

  const addToCart = (product: Product) => {
    if (!product.inStock || product.stock < 1) return;

    setCart(prev => [...prev, product]);

    setProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, stock: 0, inStock: false } : p
      )
    );

    setPage("cart");
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));

    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, stock: 1, inStock: true } : p
      )
    );
  };

  const toggleStock = (id: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, inStock: !p.inStock, stock: p.inStock ? 0 : 1 }
          : p
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>BLVD SAINT® Streetwear</h1>

      {page === "shop" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ border: "1px solid #333", padding: 16 }}>
              <img src={p.images[0]} style={{ width: "100%", background: "white" }} />
              <h3>{p.name}</h3>
              <p>{formatGBP(p.price)}</p>
              <p style={{ color: p.inStock ? "lime" : "red" }}>
                {p.inStock ? "In Stock" : "Out of Stock"}
              </p>
              <button
                disabled={!p.inStock}
                onClick={() => {
                  setSelectedProductId(p.id);
                  setPage("product");
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {page === "product" && selectedProduct && (
        <div>
          <button onClick={() => setPage("shop")}>← Back</button>
          <h2>{selectedProduct.name}</h2>

          <img
            src={selectedProduct.images[activeImage]}
            style={{ width: 300, background: "white" }}
          />

          <div>
            {selectedProduct.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImage(i)}
                style={{
                  width: 60,
                  margin: 6,
                  cursor: "pointer",
                  border: i === activeImage ? "2px solid white" : "1px solid #333"
                }}
              />
            ))}
          </div>

          <p>{selectedProduct.description}</p>
          <p>{formatGBP(selectedProduct.price)}</p>

          <button
            disabled={!selectedProduct.inStock}
            onClick={() => addToCart(selectedProduct)}
          >
            Add to Cart
          </button>

          <button onClick={() => toggleStock(selectedProduct.id)}>
            Toggle Stock
          </button>
        </div>
      )}

      {page === "cart" && (
        <div>
          <h2>Cart</h2>

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map(item => (
            <div key={item.id}>
              <p>{item.name}</p>
              <p>{formatGBP(item.price)}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: {formatGBP(total)}</h3>
          <p>Support: sebskull5@gmail.com</p>

          <button onClick={() => alert("Stripe checkout goes here")}>
            Checkout (GBP)
          </button>
        </div>
      )}
    </div>
  );
}
