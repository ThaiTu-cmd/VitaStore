import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const highlights = [
    {
      label: "Sản phẩm nổi bật",
      value: "...",
      note: "Bộ sưu tập bán chạy mỗi tuần",
    },
    { label: "Khuyến mãi", value: "...", note: "Ưu đãi luân phiên theo mùa" },
    {
      label: "Đánh giá",
      value: "...",
      note: "Từ cộng đồng khách hàng trung thành",
    },
  ];

  const featuredProducts = [
    // {
    //   id: 1,
    //   name: "Vitamin C Plus",
    //   price: "200.000đ",
    //   size: "Lọ 60 viên",
    //   tag: "Bán chạy",
    //   category: "Miễn dịch",
    //   rating: "4.9 ★",
    //   description:
    //     "Tăng đề kháng và hồi phục năng lượng cho lịch làm việc dày đặc.",
    //   image:
    //     "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
    // },
    // {
    //   id: 2,
    //   name: "Omega Balance",
    //   price: "320.000đ",
    //   size: "Hộp 90 viên",
    //   tag: "Mới về",
    //   category: "Tim mạch",
    //   rating: "4.7 ★",
    //   description:
    //     "Cân bằng dưỡng chất thiết yếu cho tim mạch và khả năng tập trung.",
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
    //     "Công thức collagen peptide hỗ trợ làn da khỏe và đàn hồi hơn.",
    //   image:
    //     "https://images.unsplash.com/photo-1611071536599-2726d2eb7f00?auto=format&fit=crop&w=600&q=80",
    // },
  ];

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container home-page">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">Daily wellness, designed clearly</span>
            <h1>
              Chăm sóc sức khỏe với giao diện mua sắm gọn, sáng và dễ tin cậy.
            </h1>
            <p>
              VitaStore chọn lọc thực phẩm chức năng theo nhu cầu thực tế: tăng
              đề kháng, ngủ ngon, da sáng và duy trì năng lượng mỗi ngày.
            </p>

            <div className="hero-actions">
              <Link className="primary-button" to="/products">
                Khám phá sản phẩm
              </Link>
              <Link className="secondary-button" to="/about-us">
                Câu chuyện thương hiệu
              </Link>
            </div>
          </div>

          <div className="hero-aside">
            <div className="hero-card hero-card-accent">
              <span>Gói nổi bật tuần này</span>
              <strong>Immunity Essentials</strong>
              <p>Vitamin C, Zinc và Elderberry cho lịch trình bận rộn.</p>
            </div>

            <div className="hero-card">
              <span>Giao nhanh</span>
              <strong>2h nội thành</strong>
              <p>Tư vấn sản phẩm theo mục tiêu sức khỏe trước khi đặt hàng.</p>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          {highlights.map((item) => (
            <article className="stat-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="section-heading">
          <div>
            <span className="eyebrow">Featured selection</span>
            <h2>Sản phẩm mới được khách hàng quan tâm</h2>
          </div>
          <p>
            Danh mục mở đầu với các dòng bổ sung được chọn cho nhịp sống nhanh
            và hiện đại.
          </p>
        </section>

        <section className="product-list">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </div>
  );
}
