import Header from "../components/Header";
import Footer from "../components/Footer";
import { FcShop } from "react-icons/fc";
import { FcFullTrash } from "react-icons/fc";
import { FaPeopleArrows } from "react-icons/fa";
import { LiaIdCard } from "react-icons/lia";
import { useUserAuthContext } from "../context/userAuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { userAuth } = useUserAuthContext()
  const navigate = useNavigate()
  const services = [
    {
      title: "ဆိုင်ခန်းအခွန်ပေးသွင်းမှု",
      description: "ဆိုင်ခန်းအခွန်များကို အွန်လိုင်းမှ လွယ်ကူစွာ ပေးသွင်းနိုင်ပါသည်။",
      image: <FcShop className="w-full h-40 object-fit rounded-t-2xl" />,
    },
    {
      title: "သားသတ်လိုင်စင်ထုတ်ပေးမှု",
      description: "သားသတ်လုပ်ငန်းများအတွက်လိုင်စင် တောင်းခံနိုင်ပါသည်။",
      image: <LiaIdCard className="w-full h-40 object-fit rounded-t-2xl text-blue-500" />,
    },
    {
      title: "ဈေးသန့်ရှင်းရေးဝန်ဆောင်မှု",
      description: "ဈေး၏တိုးတက်မှုအတွက် သန့်ရှင်းရေးဝန်ဆောင်မှုများကို လုပ်ဆောင်ပေးပါသည်",
      image: <FcFullTrash className="w-full h-40 object-fit rounded-t-2xl" />,
    },
    {
      title: "ဈေးပြဿနာဖြေရှင်းပေးခြင်း",
      description: "အသုံးပြုသူနှင့် ဆိုင်သည်တို့အကြား ဖြစ်ပေါ်သော ပြဿနာများကို ဖြေရှင်းပေးသော ဝန်ဆောင်မှုဖြစ်ပါသည်။",
      image: <FaPeopleArrows className="w-full h-40 object-fit rounded-t-2xl text-amber-400" />,
    },
    
  ];
  const activities = [
    {
      title: "Water Outage Resolved",
      description: "Water supply restored in Zone B after scheduled maintenance.",
      image: <FcShop className="w-full md:w-1/3 h-48 object-fit"/>,
    },
    {
      title: "Garbage Truck Route",
      description: "New garbage collection route launched in Ward 5.",
      image: <FcShop className="w-full md:w-1/3 h-48 object-fit"/>,
    },
    {
      title: "Shop Tax Deadline",
      description: "Reminder: Shop tax payment due by end of this month.",
      image: <FcShop className="w-full md:w-1/3 h-48 object-fit"/>,
    },
    {
      title: "Road Repair Ongoing",
      description: "Street construction work underway at 4th Street.",
      image: <FcShop className="w-full md:w-1/3 h-48 object-fit"/>,
    },
  ];

  const toDashboard = (e)=>{
    e.preventDefault();
    if(!userAuth){
      navigate("/login")
    }else{
      navigate("/user")
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">

      <section className="relative w-full h-screen">
        <img 
          src="/NewBG.jpg"
          alt="Background"
          className="w-full h-full object-fit"
        />

        {/* Overlay with blur and button */}
        <div className="absolute inset-0 bg-black/40 backdrop-contrast-40 flex flex-col justify-center items-center text-white text-center p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">
            ဆိုင်ခန်းအခွန်ပေးသွင်းမှု စနစ်
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-6 italic">
            “အခွန်မှန်မှန် ပေးသွင်းခြင်းဖြင့် မြို့နယ်ဖွံ့ဖြိုးမှု တိုးတက်စေပါသည်။”
          </p>

          <button
            className="btn btn-warning text-white text-sm"
            onClick={toDashboard}
          >
            {userAuth ? "အသုံးပြုသူစာမျက်နှာသို့သွားပါ" : "စတင်အသုံးပြုရန်"}
          </button>
        </div>
      </section>


        {/* Services Section */}
        <section className="p-6 bg-blue-100" id="services">
          <h2 className="text-4xl font-bold mb-6 text-center">ကျွန်တော်တို့ရဲ့၀န်ဆောင်မှုများ</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <div
                key={idx}
                className=" bg-white shadow-md border border-base-200 rounded-2xl hover:shadow-xl transition"
              >
                <figure>
                  { service.image }
                  
                </figure>
                <div className="card-body">
                  <h3 className="text-lg font-bold">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mt-10 p-6 bg-amber-200" id="usage">
          <h2 className="text-4xl font-bold mb-10 text-center">ဘယ်လိုအသုံးပြုရမလဲ?</h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "၁",
                title: "အကောင့်ဝင်ရန်",
                desc: "သင့်အကောင့်ဖြင့် ဝင်ရောက်ပါ။ အသုံးပြုသူအဖြစ်ရုံးမှာမှတ်ပုံတင်ထားဖို့လိုအပ်သည်။",
              },
              {
                step: "၂",
                title: "ဆိုင်ရွေးချယ်ခြင်း",
                desc: "မိမိပိုင်ဆိုင်သော ဆိုင်ကို ရွေးချယ်ပါ။",
              },
              {
                step: "၃",
                title: "အခွန်ပေးသွင်းခြင်း",
                desc: "တလတခါ အခွန်ပေးသွင်းပါ။",
              },
              {
                step: "၄",
                title: "ပြေစာရယူခြင်း",
                desc: "အောင်မြင်စွာပေးသွင်းပြီးသည်နှင့် ငွေပေးချေမှုပြေစာကို ရယူနိုင်ပါသည်။",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-amber-100 border border-base-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
              >
                <div className="text-4xl font-bold text-secondary mb-4 text-center">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{item.title}</h3>
                <p className="text-sm text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
