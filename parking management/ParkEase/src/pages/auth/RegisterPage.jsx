
import { Form, Link, useActionData,useNavigation } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './auth.css';

function RegisterPage() {
  const actionData = useActionData();
  const navigation = useNavigation();

   const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors || {};

  return (

     
      <div className="auth-page container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3 ">
      <div className="auth-form-container">

        <Card>
        <div className="text-center mb-4">


          
          <h2 className="fw-bold mb-2">Create an account</h2>
          <p className="text-secondary mb-0">
            Register to start using Smart Parking.
          </p>
        </div>

       



        <Form method="post">
          <div className='row g-3'>

            <div className="col-12 col-md-6">
               <FormInput
              label="Full name"
              name="name"
              type="text"
              placeholder="Your full name"
              error={errors.name}
              required
            />

            </div>
            
           
           <div className="col-12 col-md-6">
             <FormInput
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              error={errors.email}
              required
            />

           </div>

           

            <div className="col-12 col-md-6">
              <FormInput
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              error={errors.phone}
              required
            />

            </div>


            

              <div className="col-12 col-md-6">
                 <FormInput
                    label="Address"
                    name="address"
                    inputType="textarea"
                    placeholder="Enter your address"
                    error={errors.address}
                    rows={2}
                    required
                  />

              </div>
           

            <div className="col-12 col-md-6">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  error={errors.password}
                  required
                />

            </div>

          

            <div className="col-12 col-md-6">
               <FormInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              required
            />
            </div>

            
             {actionData?.serverError && (
          <div className="alert alert-danger">
            {actionData.serverError}
          </div>
        )}

            <div className='col-12 mt-4'>
              <Button type='submit' className='w-100' disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </div>

            </div>


      </Form>

            <p className="text-center text-secondary mt-4 mb-0">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-decoration-none fw-semibold"
              >
                Sign in
              </Link>
            </p>


            </Card>
          </div>
       
       
      
    </div>
    
  
  );
}

export default RegisterPage;