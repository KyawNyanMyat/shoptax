import Header from "../components/Header";
import Footer from "../components/Footer";
import MyMap from "../components/MyMap";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">ဆက်သွယ်ရန်</h1>

        {/* Contact Info */}
        <section className="mb-10 space-y-4 text-gray-700">
          <p>
            မေးခွန်းများ၊ အကြံပြုချက်များ သို့မဟုတ် အကူအညီလိုအပ်ပါက ကျွန်ုပ်တို့ကို ဆက်သွယ်နိုင်ပါသည်။
          </p>

          <div>
            <p><strong>📍 လိပ်စာ:</strong> ရမည်းသင်းမြို့, မန္တလေးတိုင်းဒေသကြီး, မြန်မာ</p>
            <p><strong>📞 ဖုန်း:</strong> ၀၉ ၄၄၉၈၇ ၀၁၁၅</p>
            <p><strong>🕒 ရုံးဖွင့်ချိန်:</strong> တနင်္လာ - သောကြာ၊ မနက် ၉:၃၀ မှ ညနေ ၅:၀၀</p>
          </div>
        </section>

        {/* Map */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">တည်နေရာမြေပုံ</h2>
          <div className="w-full h-64 bg-base-200 rounded-xl overflow-hidden">
            <MyMap />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
