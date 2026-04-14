import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const products = [
    // {
    //   id: 1,
    //   name: "Vitamin C Plus",
    //   price: "200.000đ",
    //   size: "Lọ 60 viên",
    //   tag: "Bán chạy",
    //   category: "Miễn dịch",
    //   rating: "4.9 ★",
    //   description:
    //     "Bổ sung vitamin C đậm đặc, hỗ trợ sức đề kháng trong ngày dài.",
    //   image:
    //     "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
    // },
    // {
    //   id: 2,
    //   name: "Omega Balance",
    //   price: "320.000đ",
    //   size: "Hộp 90 viên",
    //   tag: "Cho dân văn phòng",
    //   category: "Tim mạch",
    //   rating: "4.7 ★",
    //   description:
    //     "Hỗ trợ tim mạch, trí não và giảm mệt mỏi trong cường độ làm việc cao.",
    //   image:
    //     "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80",
    // },
    // {
    //   id: 3,
    //   name: "Collagen Glow",
    //   price: "450.000đ",
    //   size: "Hộp 30 gói",
    //   tag: "Premium",
    //   category: "Làm đẹp",
    //   rating: "4.8 ★",
    //   description:
    //     "Collagen peptide vị dễ uống, phù hợp chu trình chăm sóc da hằng ngày.",
    //   image:
    //     "https://images.unsplash.com/photo-1611071536599-2726d2eb7f00?auto=format&fit=crop&w=600&q=80",
    // },
    // {
    //   id: 4,
    //   name: "Sleep Reset",
    //   price: "280.000đ",
    //   size: "Lọ 45 viên",
    //   tag: "Thư giãn",
    //   category: "Giấc ngủ",
    //   rating: "4.6 ★",
    //   description:
    //     "Melatonin kết hợp thảo mộc giúp ngủ sâu và thư giãn tốt hơn.",
    //   image:
    //     "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    // },
  ];

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container listing-page">
        <section className="section-heading section-heading-tight">
          <div>
            <span className="eyebrow">Product catalog</span>
            <h1>Tất cả sản phẩm</h1>
          </div>
          <p>
            Danh mục được sắp theo nhu cầu phổ biến, giữ trải nghiệm xem nhanh
            nhưng vẫn đủ thông tin để ra quyết định.
          </p>
        </section>

        <section className="product-list product-list-wide">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </div>
  );
}
