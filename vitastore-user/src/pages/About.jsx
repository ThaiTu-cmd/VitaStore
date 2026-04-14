import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="container about-page">
        <section className="section-heading section-heading-tight">
          <div>
            <span className="eyebrow">About VitaStore</span>
            <h1>
              Thiết kế trải nghiệm mua wellness rõ ràng, đáng tin và dễ quay
              lại.
            </h1>
          </div>
          <p>
            VitaStore tập trung vào nhóm sản phẩm bổ sung sức khỏe chất lượng
            cao, giữ thông tin cô đọng để khách hàng quyết định nhanh nhưng vẫn
            đủ cơ sở.
          </p>
        </section>

        <section className="about-grid"></section>
      </main>
    </div>
  );
}
