import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterUser } from '../api/data';

const Register = () => {
    const navigate = useNavigate();
    const [customerSignUp, setCustomerSignUp] = useState({
      name:"",
      email: "",
      password: "",
    });
    const handleChange = (event) => {
      setCustomerSignUp({
        ...customerSignUp,
        [event.target.name]: event.target.value,
      });
    };

    const registerUserHandle = async (event) => {
        event.preventDefault();
        console.log('LoginUserHandle',customerSignUp)
        try {
          const response = await RegisterUser(customerSignUp);
          if (response.success) {
            setCustomerSignUp({
              name:"",
              email: "",
              password: "",
            });
            navigate('/login');
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.log(error);
        }
      };

      
  return (
    <>
    <Box w={['90%','80%','50%','25%']} margin={'auto'} mt={10}>
      <form onSubmit={registerUserHandle}>
      <div>
          <h4>Name</h4>
          <Input
             type="text"
             name="name"
             value={customerSignUp.name}
             onChange={handleChange}
          />
        </div>

        <div>
          <h4>Email</h4>
          <Input
           type="email"
            name="email"
            value={customerSignUp.email}
            onChange={handleChange}
          />
        </div>

        <div isRequired mt={6}>
          <h4>Password</h4>
          <Input
             type="password"
             name="password"
             value={customerSignUp.password}
             onChange={handleChange}
          />
        </div>
       

        <Button
          bg={'green.700'}
          variant="outline"
          type="submit"
          width="full"
          mt={10}
          color={'white'}
        >
          Login
        </Button>
      </form>
      <Flex gap={2} mt={10} justifyContent='center'>
        <Text>
        Already have an account ?
        </Text>
        <Link to={'/login'} > <Text>
        Login
          </Text></Link>
      </Flex>
    </Box>
  </>
  )
}

export default Register