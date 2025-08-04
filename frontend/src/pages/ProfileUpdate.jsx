import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Avatar,
  IconButton,
  useToast,
  Flex,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useUpdateProfileMutation, useGetProfileQuery } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user);
console.log(user)

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: profileData, isLoading: isProfileLoading, isSuccess } = useGetProfileQuery();
console.log(profileData)
  const formBg = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('lg', 'dark-lg');

  useEffect(() => {
    if (isSuccess && profileData) {
      dispatch(setCredentials({ token, user: profileData }));
      setFormData({
        fullname: profileData.fullname || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
      });

      if (profileData.profileimage) {
        setPreview(`http://localhost:8000/uploads/profiles/${profileData.profileimage}`);
      }
    }
  }, [isSuccess, profileData, dispatch, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append('fullname', formData.fullname);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);

    if (image) {
      payload.append('profileImage', image);
    } else if (removeImage) {
      payload.append('removeImage', 'true');
    }

    try {
      const result = await updateProfile(payload).unwrap();
      dispatch(setCredentials({ token, user: result.updatedUser }));

      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  if (isProfileLoading) {
    return (
      <Box padding="6" boxShadow="lg" bg={formBg} maxW="md" mx="auto" mt={10} borderRadius="lg">
        <SkeletonCircle size="20" mx="auto" />
        <SkeletonText mt="6" noOfLines={4} spacing="4" skeletonHeight="3" />
        <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="3" />
      </Box>
    );
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow={boxShadow}
      bg={formBg}
    >
      <Stack spacing={4}>
        <Flex justify="center" align="center" position="relative">
          <label htmlFor="image-upload">
            <Avatar
              size="xl"
              src={preview}
              name={formData.email}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
            />
          </label>
          {preview && (
            <IconButton
              icon={<CloseIcon />}
              size="xs"
              position="absolute"
              top={0}
              right="calc(50% - 30px)"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            />
          )}
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            display="none"
          />
        </Flex>

        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input name="fullname" value={formData.fullname} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone</FormLabel>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
          Update Profile
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfileUpdate;
