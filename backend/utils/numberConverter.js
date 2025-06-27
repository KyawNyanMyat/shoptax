export const myanmarToEnglish = (myanmarNumber) => {
    const mm = "၀၁၂၃၄၅၆၇၈၉";
    const en = "0123456789";
  
    return myanmarNumber
      .split("")
      .map(char => {
        const index = mm.indexOf(char);
        return index !== -1 ? en[index] : char;
      })
      .join("");
  };
