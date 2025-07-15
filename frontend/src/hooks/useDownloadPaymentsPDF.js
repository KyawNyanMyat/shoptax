import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const useDownloadPaymentsPDF = () => {
  const downloadPDF = async (payments) => {
    const doc = new jsPDF();
    
    // Fetch font as array buffer
    const fontUrl = "/fonts/Pyidaungsu-2.5.3_Regular.ttf";
    const fontBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer());

    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }
    
    // usage
    const fontData = arrayBufferToBase64(fontBuffer);


    // Register font in jsPDF
    doc.addFileToVFS("Pyidaungsu.ttf", fontData);
    doc.addFont("Pyidaungsu.ttf", "Pyidaungsu", "normal");
    doc.setFont("Pyidaungsu");

    // Prepare table data
    const tableData = payments.map((payment, index) => [
      index + 1,
      payment._id,
      payment.userId.username,
      `${payment.shopId.marketHallNo} / ${payment.shopId.shopNo}`,
      payment.paymentType === "Shop Rent Cost" ? "ဆိုင်ဌားခ" : "ရက်ေကျာ်ြကေး",
      payment.amount + " Ks",
      new Date(payment.paidDate).toLocaleDateString(),
      payment.status === "Pending" ? "ေစာင့်ဆိုင်း" : payment.status === "Finished" ? "ေအာင်ြမင်ြပီး" : "ြငင်းဆိုခဲ့သည်",
    ]);

    // Use font explicitly for autotable (both head and body)
    autoTable(doc, {
      head: [["စဥ်", "ID", "အမည်", "ဆိုင်", "အမျိုးအစား", "ပမာဏ", "ေငွေပးေချရက်", "အေြခအေန"]],
      body: tableData,
      styles: {
        font: "Pyidaungsu",
        fontSize: 10,
      },
      headStyles: {
        fontStyle: "normal",
        fontSize: 10,
        fillColor: [230, 247, 255],
        textColor: 20,
      },      
    });

    doc.save("payments-report.pdf");
  };

  return downloadPDF;
};

export default useDownloadPaymentsPDF;
