import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


const useLogin = ()=>{
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const login = async (formData) => {
        setloading(true)
        try {
            const res = await fetch("/api/users/login",{
                method:"POST",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"}
            })

            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");
            }

            const now = new Date();
            const userWithExpiry = {
                value: data,
                expiry: now.getTime() + 1000 * 60 * 60 * 24,
            };

            localStorage.setItem("user-dashboard", JSON.stringify(userWithExpiry))
            toast.success("အကောင့်၀င်ချင်းအောင်မြင်ပါသည်", {id:'user-login',duration: 2000});
            navigate("/user")
        } catch (error) {
            console.log('Error in useLogin hook',error)
            toast.error(error.message, {id:"user-login-error",duration: 1500})
        }
        finally{
            setloading(false)
        }
    }
    return { loading, login }
}

export default useLogin