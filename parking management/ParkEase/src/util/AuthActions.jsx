import { redirect } from "react-router-dom";

import api from "./api";
import { validateRegisterForm, validateLoginForm } from "./validations";


export async function registerAction({request})
{
    const formData = await request.formData();

    const data = Object.fromEntries(formData);

    const errors = validateRegisterForm(data);
    

    if(Object.keys(errors).length > 0)
    {
        return {
            errors: errors
        };
    }

    const { confirmPassword, ...registerData} = data;

    try{
        const res = await api.post("/auth/register", registerData);
        console.log("Register " , res.data);

        
         const registerData = res.data;

         localStorage.setItem("token", registerData.token);
        
        localStorage.setItem("role", registerData.role);
        localStorage.setItem("name", registerData.name);

         if (loginData.role === "CUSTOMER") 
        {
            return redirect("/customer");
        }

         if (loginData.role === "ADMIN")
        {
            return redirect("/admin");
        }


       return {serverError: "Invalid user role."};

    }catch(error){
        return {
            serverError: error.response?.data?.message || "Registration failed. Please try again."
        };
    }

}


export async function loginAction({ request }) 
{

   

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const errors = validateLoginForm(data);

    if (Object.keys(errors).length > 0) {
        return {
            errors: errors
        };
    }

    try {

        console.log( data);

        const response = await api.post("/auth/login",data);

         console.log("Login Response:", response.data);

         const loginData = response.data;

         localStorage.setItem("token", loginData.token);
        
        localStorage.setItem("role", loginData.role);
        localStorage.setItem("name", loginData.name);

         if (loginData.role === "CUSTOMER") 
        {
            return redirect("/customer");
        }

         if (loginData.role === "ADMIN")
        {
            return redirect("/admin");
        }

        return {serverError: "Invalid user role."};

    } catch (error) {
        return {
            serverError: error.response?.data?.message || "Login failed. Please check your email and password."
                                
        };
    }
}



