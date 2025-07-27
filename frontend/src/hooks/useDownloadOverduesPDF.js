import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const useDownloadOverduesPDF = () => {
  const downloadOverduesPDF = async (overdues) => {
    const doc = new jsPDF();

    // Fetch font as array buffer
    const fontUrl = "/fonts/Pyidaungsu-2.5.3_Regular.ttf";
    const fontBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer());

    // Convert to base64
    function arrayBufferToBase64(buffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    }

    const fontData = arrayBufferToBase64(fontBuffer);

    // Register font
    doc.addFileToVFS("Pyidaungsu.ttf", fontData);
    doc.addFont("Pyidaungsu.ttf", "Pyidaungsu", "normal");
    doc.setFont("Pyidaungsu");

    // Prepare table data
    const tableData = overdues.map((payment, index) => [
      index + 1,
      payment.userId?.username || "မသိရ",
      `${payment.shopId?.marketHallNo || "?"} / ${payment.shopId?.shopNo || "?"}`,
      new Date(payment.paidDate).toLocaleDateString("my-MM", {
        year: "numeric",
        month: "long",
      }),
      new Date(payment.nextPaymentDueDate).toLocaleDateString("my-MM"),
      `${payment.overdueDays} ရက်`,
    ]);

    // Add a title
    doc.setFontSize(14);
    doc.text("အကြွေးတင်ဆိုင်များ စာရင်း", 105, 15, { align: "center" });

    // Create table
    autoTable(doc, {
      head: [["စဥ်", "အမည်", "ေဈးရုံ/ဆိုင်", "ေငွေပးချေသည့်လ", "တင်သွင်းရမည့်ရက်", "အေြကွးတင်ထားေသာရက်"]],
      body: tableData,
      startY: 20,
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

    // Save
    doc.save("overdue-report.pdf");
  };

  return downloadOverduesPDF;
};

export default useDownloadOverduesPDF;
