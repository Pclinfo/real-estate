// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useLoginAdminMutation } from '../services/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/userSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  useToast,
  VStack,
  Spinner,
  Text,
  Link,
  Flex,
} from '@chakra-ui/react';

const AdminLogin = () => {
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(formData).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res, role: 'admin', isAdmin: true, isSuperAdmin: false, isAuthenticated: true }));
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position:'top'
      });
      navigate('/');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box
      maxW={{ base: '90%', sm: '400px' }}
      mx="auto"
      mt={24}
      p={6}
      boxShadow="lg"
      borderRadius="xl"
      bg="white"
      _dark={{ bg: 'gray.800' }}
    >
      <Heading textAlign="center" mb={6} size="lg">
        Admin Login
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="emailOrPhone"
              type="email"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="admin@example.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormControl>

          {/* Forgot password link */}
          <Flex width="100%" justify="flex-end">
            <Link
              as={RouterLink}
              to="/forgot-password"
              color="blue.500"
              fontSize="sm"
              _hover={{ textDecoration: 'underline' }}
            >
              Forgot Password?
            </Link>
          </Flex>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isDisabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : 'Login'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AdminLogin;
