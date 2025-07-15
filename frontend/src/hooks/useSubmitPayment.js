import { useState } from "react"
import toast from "react-hot-toast"

const useSubmitPayment = ()=>{
    const [loading, setloading] = useState(false)
    const submitPayment = async (formData)=>{

        setloading(true)
        try {
            const res = await fetch("/api/payments/", {
                method: "POST",
                body: formData,
            });
          
            const data = await res.json();
          
            if (!res.ok) throw new Error(data.message || "Update လုပ်တာမအောင်မြင်ပါ");
            
            toast.success("ငွေပေးချေမှု တင်သွင်းမှုအောင်မြင်ပါသည်", {duration:2500})
            return true

        } catch (error) {
            console.log("Error in useSubmitPayment hook", error.message)
            toast.error(error.message, {duration: 1500})
            return false
        }
        finally{
            setloading(false)
        }
    }

    return { submitPayment, loading }
}

export default useSubmitPayment