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

type CartItem = Product & {
  size: string;
  quantity: number;
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);

  const selectedProduct =
    products.find(p => p.id === selectedProductId) || null;

  useEffect(() => {
    setActiveImage(0);
    setSelectedSize("S");
    setQuantity(1);
  }, [selectedProductId]);

  const addToCart = (product: Product) => {
    if (!product.inStock || product.stock < 1) return;

    const item: CartItem = {
      ...product,
      size: selectedSize,
      quantity
    };

    setCart(prev => [...prev, item]);

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

  const anyOutOfStock = cart.some(item => !item.inStock);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>BLVD SAINT® Streetwear</h1>

      {page === "shop" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ border: "1px solid #333", padding: 16, position: "relative" }}>
              {!p.inStock && (
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "red",
                  color: "white",
                  padding: "4px 10px",
                  fontSize: 12
                }}>
                  OUT OF STOCK
                </div>
              )}

              <img src={p.images[0]} style={{ width: "100%", background: "white" }} />
              <h3>{p.name}</h3>
              <p>{formatGBP(p.price)}</p>

              <button
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
