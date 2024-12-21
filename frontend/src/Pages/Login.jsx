import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
// import { Box, Button, Flex, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../api/data";

const Login = () => {
  const navigate = useNavigate();
  const [customerSignUp, setCustomerSignUp] = useState({
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
      // console.log('LoginUserHandle',customerSignUp)
      try {
        const response = await LoginUser(customerSignUp);
        console.log("response",response)
        if (response.success) {
          localStorage.setItem('token', response.data);
          window.location.href="/";
          setCustomerSignUp({
            email: "",
            password: "",
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
       console.log(error);
      }
    };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  
  return (
    <>
      <Box w={["90%", "80%", "50%", "25%"]} margin={"auto"} mt={10}>
        <form onSubmit={registerUserHandle}>

          <div isRequired>
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
            bg={"green.700"}
            variant="outline"
            type="submit"
            width="full"
            mt={10}
            color={"white"}
          >
            Login
          </Button>

        </form>
        <Flex gap={2} mt={10} justifyContent="center">
          <Text>Don't have an account ?</Text>
          <Link to={"/register"}>
            {" "}
            <Text>Register</Text>
          </Link>
        </Flex>
      </Box>
    </>
  );
};

export default Login;
