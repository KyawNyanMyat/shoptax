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
          
            if (!res.ok) throw new Error(data.message || "Failed to upload");
            
            toast.success("Submit Success", {duration:1500})
            console.log("Image URL:", data.paymentPhoto);

        } catch (error) {
            console.log("Error in useSubmitPayment hook", error.message)
            toast.error(error.message, {duration: 1500})
        }
        finally{
            setloading(false)
        }
    }

    return { submitPayment, loading }
}

export default useSubmitPayment