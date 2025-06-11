import React, { useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";

const SubmitPaymentProof = () => {
  const [screenshot, setScreenshot] = useState(null);

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd send this to backend here
    alert("Payment proof submitted successfully!");
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Submit Payment Proof</h2>
          <p className="text-sm text-gray-600 mb-6">
            Upload a screenshot of your payment (e.g., KBZPay, WavePay). Please ensure the date and amount are clearly visible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

          <div>
              <label className="label">UserName</label>
              <input
                type="text"
                className="input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Building No</label>
                <input type="text" className="input input-bordered w-full focus:outline-offset-0" required />
              </div>
              <div>
                <label className="label">Shop No</label>
                <input type="text" className="input input-bordered w-full focus:outline-offset-0" required />
              </div>
            </div>

            <div>
              <label className="label">Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="label">Note (optional)</label>
              <textarea className="textarea textarea-bordered w-full focus:outline-offset-0" placeholder="Add any additional note (optional)"></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Submit Payment Proof
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitPaymentProof;