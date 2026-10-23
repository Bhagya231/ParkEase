
import { Form, Link, useActionData, useNavigation } from 'react-router-dom';
import { useState } from 'react';

import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './auth.css';
import img from "../../assets/fab.jpg";




function LoginPage() {

  const actionData = useActionData();
  const navigation = useNavigation();

  const [editedFields, setEditedFields] = useState({});
  const errors = actionData?.errors || {};
  const isSubmitting = navigation.state === "submitting";

  function handleFieldChange(feildName)
  {
    setEditedFields((prev) => ({...prev,[feildName]: true,}))
  }

  function getFieldError(fieldName)
  {
    if (editedFields[fieldName])
    {
      return undefined;

    }
    return errors[fieldName];
  }

  return (
  <div className="auth-page container-fluid min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="auth-form-container login-form-container">

                    <Card>

                      <div className="d-flex   gap-2 mb-1 ml-2">
                        
                        <img src={img} alt="SmartPark Logo" width="40" height="40" className="object-fit-contain" />
                        <div>
                          <h2 className="fw-bold text-success ">
                            ParkEase
                          </h2>
                          
                        </div>

                      </div>

                      <p className="text-secondary mb-3">
                            Sign in to your Smart Parking account.
                           </p>
                      
                      
                  
                      <Form method="post">

                        <FormInput
                          label="Email address"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          error={getFieldError("email")}
                          required
                          onChange={() => handleFieldChange("email")}
                        />

                        <FormInput
                          label="Password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          error={getFieldError("password")}
                          required
                          onChange={() => handleFieldChange("password")}
                        />

                        {actionData?.serverError && (
                          <div className="alert alert-danger">
                            {actionData.serverError}
                          </div>
                        )}


                        <div className='mt-4'>
                          <Button type='submit' fullWidth disabled={isSubmitting}>{isSubmitting ? "Signing In..." : "Sign In"}</Button>

                        </div>


                        

                        <div className="text-center mt-4">
                          <span className="text-secondary">
                            Don't have an account?{' '}
                          </span>

                          <Link
                            to="/register"
                            className="text-decoration-none fw-semibold text-success"
                          >
                            Create account
                          </Link>
                        </div>
                      </Form>
                    </Card>
                  </div>
                </div>
        
    
  );
}

export default LoginPage;
