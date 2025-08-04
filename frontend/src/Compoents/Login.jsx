// // components/Login.jsx
// import React, { useState } from 'react';
// import {
//   Box, Button, FormControl, FormLabel, Input, Stack,
//   Heading, Text, useToast, Flex, useColorModeValue
// } from '@chakra-ui/react';
// import { useLoginMutation } from '../services/auth';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import {setCredentials } from '../features/userSlice';

// const Login = () => {
//   const dispatch = useDispatch();
//   const [emailOrPhone, setEmailOrPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [login, { isLoading }] = useLoginMutation();
//   const toast = useToast();
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await login({ emailOrPhone, password }).unwrap();

//       const normalizedUser = {
//         user_id: res.user.user_id,
//         fullname: res.user.fullname,
//         email: res.user.email,
//         phone: res.user.phone,

//       };
// console.log({token: res.token, user: normalizedUser});
//       dispatch(setCredentials({ token: res.token, user: normalizedUser }));

//       toast({
//         title: 'Login successful',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });

//       navigate('/');
//     } catch (error) {
//       toast({
//         title: 'Login failed',
//         description: error?.data?.error || 'Something went wrong',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };

//   return (
//     <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
//       <Box w="full" maxW="lg" p={8} borderRadius="lg" boxShadow="lg" bg={useColorModeValue('white', 'gray.800')}>
//         <Stack spacing={6}>
//           <Heading fontSize="3xl" textAlign="center">Login</Heading>
//           <FormControl isRequired>
//             <FormLabel>Email or Phone</FormLabel>
//             <Input
//               type="text"
//               value={emailOrPhone}
//               onChange={(e) => setEmailOrPhone(e.target.value)}
//               placeholder="Enter email or phone"
//             />
//           </FormControl>
//           <FormControl isRequired>
//             <FormLabel>Password</FormLabel>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//             />
//           </FormControl>
//           <Button colorScheme="blue" isLoading={isLoading} onClick={handleLogin}>Login</Button>
//           <Text fontSize="sm" textAlign="center" color="gray.500">
//             Use your registered email or phone number to login.
//           </Text>
//         </Stack>
//       </Box>
//     </Flex>
//   );
// };

// export default Login;

// === src/Compoents/Login.jsx ===
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  Flex,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useLoginMutation } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/userSlice";

const Login = ({ onSignupLinkClick }) => {
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ emailOrPhone, password }).unwrap();
      const normalizedUser = {
        user_id: res.user.user_id,
        fullname: res.user.fullname,
        email: res.user.email,
        phone: res.user.phone,
      };

      dispatch(
        setCredentials({
          token: res.token,
          user: normalizedUser,
          role: "user",
          isAuthenticated: true,
          isAdmin: false,
          isSuperAdmin: false,
        })
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Flex align="center" justify="center" px={4}>
      <Box
        w="full"
        maxW="lg"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Stack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Email or Phone</FormLabel>
            <Input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="Enter email or phone"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleLogin}
          >
            Login
          </Button>
          {/* ✅ Forgot Password Link */}
          <Text fontSize="sm" textAlign="center">
            <Link color="blue.500" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Link>
          </Text>
          <Text fontSize="sm" textAlign="center" color="gray.500">
            Don't have an account?{" "}
            <Link color="blue.500" onClick={onSignupLinkClick}>
              Sign up
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
