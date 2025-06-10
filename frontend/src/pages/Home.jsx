import Header from "../components/Header";
import Footer from "../components/Footer";
import { FcShop } from "react-icons/fc";
import { FcFullTrash } from "react-icons/fc";
import { LuConstruction } from "react-icons/lu";
import { GiWaterTank } from "react-icons/gi";

const Home = () => {
  const services = [
    {
      title: "Shop Taxes",
      description: "Manage and pay shop taxes online securely.",
      image: <FcShop className="w-full h-40 object-fit rounded-t-2xl"/>,
    },
    {
      title: "Water Distribution",
      description: "Updates and info about water supply services.",
      image: <GiWaterTank className="w-full h-40 object-fit rounded-t-2xl"/>,
    },
    {
      title: "Garbage Collection",
      description: "Schedules and requests for garbage collection.",
      image: <FcFullTrash className="w-full h-40 object-fit rounded-t-2xl"/>,
    },
    {
      title: "Street Construction",
      description: "Track construction and small road maintenance.",
      image: <LuConstruction className="w-full h-40 object-fit rounded-t-2xl"/>,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow p-6">
        {/* Services Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Our Services</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <div
                key={idx}
                className=" bg-base-100 shadow-md border border-base-200 rounded-2xl hover:shadow-xl transition"
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

        {/* Activities Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Our Activities</h2>
          <div className="space-y-8">
            {activities.map((activity, idx) => (
              <div
                key={idx}
                className="bg-base-100 shadow-md border border-base-200 rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center"
              >
                {/* Image */}
                { activity.image }

                {/* Text Content */}
                <div className="p-4 md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600">
                    {activity.description} Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed tincidunt, turpis in posuere lacinia, nisi nisi
                    fermentum risus, vitae tempor magna eros id lacus.
                  </p>
                </div>
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
