import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        {/* Contact Info */}
        <section className="mb-10 space-y-4 text-gray-700">
          <p>
            Have questions, suggestions, or need assistance? Reach out to us through any of the methods below.
          </p>

          <div>
            <p><strong>📍 Address:</strong> Yamethin, Mandalay Region, Myanmar</p>
            <p><strong>📞 Phone:</strong> +95 9743 37432</p>
            <p><strong>📧 Email:</strong> kyawnyanmyat40@gmail.com</p>
            <p><strong>🕒 Office Hours:</strong> Mon - Fri, 9:00 AM - 5:00 PM</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="textarea textarea-bordered w-full"
            ></textarea>
            <button className="btn btn-primary">Submit</button>
          </form>
        </section>

        {/* Map Placeholder */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
          <div className="w-full h-64 bg-base-200 flex items-center justify-center rounded-xl text-gray-500">
            [ Google Map Placeholder ]
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
