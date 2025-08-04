

import React, { useState } from 'react';
import {
  Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepSeparator,
  StepTitle, useSteps, Box, Button, VStack, Input, HStack,
  PinInput, PinInputField, Text, useToast, Heading,
  FormControl, FormErrorMessage, InputGroup, InputRightElement,
  useBreakpointValue, useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupMutation,
} from '../services/auth'; // ✅ Adjust path as needed

const steps = [
  { title: 'Signup' },
  { title: 'Verify' },
  { title: 'Success' },
];

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian format

export default function SignupStepper() {
  const { activeStep, setActiveStep } = useSteps({ index: 0, count: steps.length });
  const toast = useToast();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [form, setForm] = useState({ fullname: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const [signup, { isLoading: signingUp }] = useSignupMutation();

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!form.email.trim() || !isValidEmail(form.email)) newErrors.email = 'Valid email is required';
    if (!form.phone.trim() || !isValidPhone(form.phone)) newErrors.phone = 'Valid 10-digit phone is required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    try {
      await sendOtp({ email: form.email, phone: form.phone }).unwrap();
      toast({
        title: 'OTP sent.',
        description: 'Check your email inbox.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setActiveStep(1);
    } catch (err) {
      toast({
        title: 'OTP sending failed',
        description: err?.data?.error || 'Please check phone and email',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleVerify = async () => {
    const cleanedPhone = form.phone.replace(/\D/g, '');
    const cleanedOtp = otp.trim();

    if (cleanedOtp.length !== 4) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 4-digit OTP',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      await verifyOtp({ phone: cleanedPhone, otp: cleanedOtp }).unwrap();
      await signup({ ...form, otp: cleanedOtp }).unwrap();

      toast({
        title: 'Signup successful',
        description: 'Welcome to PCL Info Tech!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      setActiveStep(2); // Move directly to success
    } catch (err) {
      toast({
        title: 'Verification failed',
        description: err?.data?.error || 'Invalid OTP or signup error',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <Box
      borderWidth={1}
      borderRadius="xl"
      boxShadow="2xl"
      p={{ base: 6, md: 10 }}
      bg={useColorModeValue('white', 'gray.900')}
    >
      <Heading size="lg" mb={8} textAlign="center" color="blue.600">
        Create Your Account
      </Heading>

      <Stepper
        size="sm"
        index={activeStep}
        colorScheme="blue"
        mb={8}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle fontSize="sm">{step.title}</StepTitle>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <VStack spacing={5}>
          <FormControl isInvalid={errors.fullname}>
            <Input placeholder="Full Name" name="fullname" value={form.fullname} onChange={handleInput} isDisabled={sendingOtp} />
            <FormErrorMessage>{errors.fullname}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <Input placeholder="Email" name="email" type="email" value={form.email} onChange={handleInput} isDisabled={sendingOtp} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.phone}>
            <Input placeholder="Phone Number" name="phone" value={form.phone} onChange={handleInput} isDisabled={sendingOtp} />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <InputGroup>
              <Input
                placeholder="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInput}
                isDisabled={sendingOtp}
              />
              <InputRightElement width="3rem">
                <Button h="1.5rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" width="full" onClick={handleSendOtp} isLoading={sendingOtp}>
            Send OTP
          </Button>
        </VStack>
      )}

      {activeStep === 1 && (
        <VStack spacing={6}>
          <Text textAlign="center" fontSize="lg">Enter the 4-digit OTP sent to your email</Text>
          <HStack justify="center" spacing={2}>
            <PinInput otp value={otp} onChange={setOtp} isDisabled={verifyingOtp || signingUp}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <Button colorScheme="blue" width="full" onClick={handleVerify} isLoading={verifyingOtp || signingUp}>
            Verify & Signup
          </Button>
        </VStack>
      )}

      {activeStep === 2 && (
        <Box textAlign="center" py={{ base: 6, md: 10 }}>
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            🎉 Signup Successful!
          </Text>
          <Text mt={3} fontSize="md">Welcome to PCL Info Tech. You can now log in.</Text>
          <Button mt={6} colorScheme="blue" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      )}
    </Box>
  );
}
