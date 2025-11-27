import axios from "axios";
import validationError from "./validationError";
import { toast } from "react-toastify";

/**
 * @param {any} error -AxiosError or other error
 * @param {Function} setError - optional RHF setError
 */
export function handleAxiosError(error, setError) {

  //Network error
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK") return toast.error("Network error. Please check your connection or server.");
  }
   
  //Server responded with a status code
  if (error.response) {
  
    const status = error.response?.status;
   
    if(status === 409 && error.response.data){
   
       return toast.error(error.response.data.message);
    }
   
    //Backend validation error (Laravel style: {errors: {field: ["message"]}})
    if (status === 422 && error.response.data?.errors) {
     
      const backendErrors = error.response.data.errors;
      validationError(backendErrors, setError);

      return toast.error("Validation error. Please check your input");

    }

    //Other client errors
    if(status >= 400 && status < 500){
      const message = error.response?.data?.message || "Request failed";
      return toast.error(message);
    } 

    //Server errors
    if(status >= 500){
      return toast.error("Server error. Please try again later.");

    }

    //No response from server
    if(error.request){
      return toast.error("No response from serverr. Please try again");
    }
   
    
  }

  //Non-Axios error (JS error)
  console.error(error)
  return toast.error("Unexpected error occured");

}