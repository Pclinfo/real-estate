
import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  IconButton,
  Button,
  useDisclosure,
  Image,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import {
  FaBars,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaMoon,
  FaSun,
} from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import { toggleColorMode } from '../features/themeSlice';
import { logout as logoutAction } from '../features/userSlice';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Links = [
  { label: 'Home', to: '/' },
  { label: 'Asset Management', to: '/asset-management' },
  { label: 'Investment', to: '/investment' },
  { label: 'Construction Consultancy', to: '/construction-consultancy' },
];

const NavLink = ({ to, children, onClick }) => (
  <Button
    as={RouterLink}
    to={to}
    variant="ghost"
    fontWeight="bold"
    _hover={{ textDecoration: 'none', color: 'blue.400' }}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default function NavBar({ onRegisterClick }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const bg = useColorModeValue('white', 'gray.800');
  const navColor = useColorModeValue('gray.800', 'white');

  const profileImage = useSelector((state) => state.user.user?.profileImage);
  const userEmail = useSelector((state) => state.user.user?.email);
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  console.log(isAuthenticated)
  console.log(user); 
  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  const handleEditProfile = () => {
    onClose(); // Ensure drawer closes before navigating
    navigate('/profile');
  };
const handleUploadProperty = () => {
    onClose(); // Ensure drawer closes before navigating
    navigate('/property');
}
  return (
    <Box bg={bg} color={navColor} boxShadow="md" position="sticky" top="0" zIndex="999">
      {/* Top-right social icons */}
      <Flex justify="flex-end" pr={4} pt={2}>
        <HStack spacing={2}>
          <IconButton as="a" href="https://facebook.com" icon={<FaFacebook />} size="sm" variant="ghost" aria-label="Facebook" />
          <IconButton as="a" href="https://twitter.com" icon={<FaTwitter />} size="sm" variant="ghost" aria-label="Twitter" />
          <IconButton as="a" href="https://instagram.com" icon={<FaInstagram />} size="sm" variant="ghost" aria-label="Instagram" />
          <IconButton
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={() => dispatch(toggleColorMode())}
            aria-label="Toggle Theme"
            size="sm"
            variant="ghost"
          />
        </HStack>
      </Flex>

      {/* Main navbar */}
      <Flex align="center" justify="space-between" px={4} py={3}>
        <Image src="/logo.png" alt="Logo" h="50px" as={RouterLink} to="/" />

        {/* Center nav links (desktop only) */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }} justify="center" flex={1}>
          {Links.map((link) => (
            <NavLink key={link.label} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </HStack>

        {/* Right side (desktop only) */}
        <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
          <Button variant="outline" colorScheme="blue" as={RouterLink} to="/list-property">
            List a Place
          </Button>
          {isAuthenticated ? (
            <Menu> 
              
              <MenuButton as={Button} variant="ghost" p={0}>
                <Avatar
                  size="md"
                  src={profileImage ? `http://localhost:8000/uploads/profiles/${profileImage}` : ''}
                  name={userEmail}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                 < MenuItem onClick={handleUploadProperty}>Upload Property</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="blue" onClick={onRegisterClick}>
              Login
            </Button>
          )}
        </HStack>

        {/* Mobile: Avatar + Menu + Hamburger */}
        <HStack spacing={3} display={{ base: 'flex', md: 'none' }}>
          {isAuthenticated && (
            <Menu>
              <MenuButton as={Button} variant="ghost" p={0}>
                <Avatar
                  size="sm"
                  src={profileImage ? `http://localhost:8000/uploads/profiles/${profileImage}` : ''}
                  name={userEmail}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                 < MenuItem onClick={handleUploadProperty}>Upload Property</MenuItem>
                <MenuItem onClick={() => {
                  onClose();
                  handleLogout();
                }}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
          <IconButton
            aria-label="Open Menu"
            icon={<FaBars />}
            onClick={onOpen}
            variant="ghost"
          />
        </HStack>
      </Flex>

      {/* Drawer for mobile navigation */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {Links.map((link) => (
                <NavLink key={link.label} to={link.to} onClick={onClose}>
                  {link.label}
                </NavLink>
              ))}
              <Button
                colorScheme="blue"
                variant="outline"
                width="100%"
                as={RouterLink}
                to="/list-property"
                onClick={onClose}
              >
                List a Place
              </Button>
              {!isAuthenticated && (
                <Button colorScheme="blue" onClick={() => {
                  onClose();
                  onRegisterClick();
                }} width="100%"> 
                  Login
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

