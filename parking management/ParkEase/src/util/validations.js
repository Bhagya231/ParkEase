

export function validateRegisterForm(formData)
{

     const validemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const  validPhone  = /^[6-9]\d{9}$/;
    const errors = {};

     // Name validation
    if (!formData.name.trim()) 
    {
        errors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) 
    {
        errors.name = "Name must contain at least 3 characters.";
    }


     // Email validations 
    if (!formData.email.trim()) 
    {
        errors.email = "Email is required.";

    } else if ( !validemail.test(formData.email))
    {
        errors.email = "Please enter a valid email address.";
    }


    
    // Phone
    if (!formData.phone.trim()) 
    {
        errors.phone = "Phone number is required.";
    } else if (!validPhone.test(formData.phone))
    {
        errors.phone = "Please enter a valid 10-digit phone number.";
    }

     // Address validation
    if (!formData.address.trim()) 
    {
        errors.address = "Address is required.";
    } else if (formData.address.trim().length < 10)
    {
        errors.address = "Address must contain at least 10 characters.";
    }

      // Password
    if (!formData.password)
    {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must contain at least 8 characters.";
    }

      // Confirm Password
    if (!formData.confirmPassword)
    {
        errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }


    return errors;


}



export function validateLoginForm(formData)
{
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {};


     if (!formData.email.trim()) 
    {
        errors.email = "Email is required.";

    } else if ( !validEmail.test(formData.email))
    {
        errors.email = "Please enter a valid email address.";
    }


    if (!formData.password)
    {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must contain at least 8 characters.";
    }

    return errors;

}