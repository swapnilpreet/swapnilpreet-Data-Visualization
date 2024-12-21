import { axiosInstance } from "./axiosintance";

export const GetAllRecords = async (params)=>{
    try{
      const response = await axiosInstance.get('/records', {
        params
      });
      return response.data;
    }catch(error){
      return error.message;
    }
  }



  export const RegisterUser = async (payload) => {
    try {
      const response = await axiosInstance.post('/user/register', payload)
      return response.data;
    } catch (error) {
      return error.message;
    }
  }


  export const LoginUser = async (payload) =>{
    try {
      const response = await axiosInstance.post('/user/login', payload);
      return response.data
    } catch (error) {
      return error.message;
    }
  }

  