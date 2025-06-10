import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">About the Township Development Department</h1>
        <p className="text-gray-700 mb-6 text-lg">
          The Township Development Department (TDD) is committed to improving the quality of life for all residents
          through essential public services and infrastructure development. We focus on transparency, community involvement,
          and sustainable urban planning to ensure a better future for our township.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Our Core Services</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Shop Taxes:</strong> Helping business owners manage taxes efficiently and transparently.</li>
            <li><strong>Water Distribution:</strong> Ensuring clean and reliable water supply across all wards.</li>
            <li><strong>Garbage Collection:</strong> Scheduled waste removal and sanitation for a cleaner environment.</li>
            <li><strong>Street Construction:</strong> Upgrading and maintaining roads for safer and smoother transportation.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            We strive to build a well-managed, responsive, and citizen-focused township. Through community engagement,
            digital transformation, and dedicated personnel, we aim to deliver services that matter most to the people.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Community Engagement</h2>
          <p className="text-gray-700 text-lg">
            Every <strong>Friday</strong>, we organize township-wide <strong>cleaning activities</strong> involving residents,
            shop owners, and volunteers. These events not only improve sanitation but also build strong civic relationships
            and pride in our neighborhoods.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700 text-lg">
            We welcome your feedback, concerns, and suggestions. Feel free to reach out via email, phone, or visit our office
            during working hours. Our team is here to serve you.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
