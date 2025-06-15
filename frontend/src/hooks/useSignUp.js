import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const useSignUp = () => {
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const signup = async (formData)=>{
        setloading(true)
        try {
            const res = await fetch("/api/users",{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
              }

            toast.success("Account Created Successfully", {duration: 3000})
            navigate("/login")
        } catch (error) {
            console.log('Error in useLogin hook',error)
            toast.error(error.message, {duration: 1500})
        }
        finally{
            setloading(false)
        }
    }

    return {loading, signup}
}

export default useSignUp;