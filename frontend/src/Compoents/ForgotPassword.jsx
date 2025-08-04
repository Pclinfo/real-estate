// === src/pages/ForgotPassword.jsx ===
import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Stack,
  Heading, Text, useToast, Flex, useColorModeValue,
} from '@chakra-ui/react';
import {
useSendOtpResetPasswordMutation,
  useResetPasswordMutation,
} from '../services/auth';

const ForgotPassword = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });

  const [sendOtp, { isLoading: sending }] = useSendOtpResetPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp({ email: formData.email }).unwrap(); // role removed
      toast({
        title: 'OTP sent to your email',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position:'top'
      });
      setStep(2);
    } catch (err) {
      toast({
        title: 'Failed to send OTP',
        description: err?.data?.error || 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:'top'
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({
        ...formData,
        role: 'user', // default fallback
      }).unwrap();
      toast({
        title: 'Password reset successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position:'top'
      });
      setFormData({ email: '', otp: '', newPassword: '' });
      setStep(1);
    } catch (err) {
      toast({
        title: 'Failed to reset password',
        description: err?.data?.error || 'Invalid OTP or server error',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:'top'
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" px={4} bg={useColorModeValue('gray.100', 'gray.900')}>
      <Box
        w="full"
        maxW="md"
        p={6}
        borderRadius="lg"
        boxShadow={boxShadow}
        bg={bgColor}
      >
        <Stack spacing={5}>
          <Heading fontSize="2xl" textAlign="center" color={textColor}>
            {step === 1 ? 'Forgot Password' : 'Verify OTP & Reset Password'}
          </Heading>

          {step === 1 ? (
            <>
              <FormControl isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                />
              </FormControl>
              <Button
                colorScheme="blue"
                onClick={handleSendOtp}
                isLoading={sending}
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <FormControl isRequired>
                <FormLabel color={textColor}>OTP</FormLabel>
                <Input
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color={textColor}>New Password</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </FormControl>
              <Button
                colorScheme="blue"
                onClick={handleResetPassword}
                isLoading={resetting}
              >
                Reset Password
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
