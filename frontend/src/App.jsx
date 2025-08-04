

// === src/App.jsx ===
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupStepper from './Compoents/SignupStepper';
import NavBar from './Compoents/NavBar';
import Login from './Compoents/Login';
import ProfileUpdate from './pages/ProfileUpdate';
import PostPropertyForm from './pages/PostPropertyForm';
import Home from './pages/Home'; 
import PropertyList from './pages/PropertyList';
import { useSelector } from 'react-redux';
import ChatBox from './Compoents/ChatBox';

import AdminLogin from './Compoents/AdminLogin';
import SuperAdminLogin from './Compoents/SuperAdminLogin';
import ChatWrapper from "./Compoents/ChatWrapper";
import {
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import ForgotPassword from './Compoents/ForgotPassword';

function ThemeSync() {
  const reduxMode = useSelector((state) => state.theme.colorMode);
  const { colorMode, setColorMode } = useColorMode();

  React.useEffect(() => {
    if (reduxMode !== colorMode) {
      setColorMode(reduxMode);
    }
  }, [reduxMode, colorMode, setColorMode]);

  return null;
}
 
const App = () => {
  const {
    isOpen: isSignupOpen,
    onOpen: openSignup,
    onClose: closeSignup,
  } = useDisclosure();

  const {
    isOpen: isLoginOpen,
    onOpen: openLogin,
    onClose: closeLogin,
  } = useDisclosure();
  const loggedInUserId = '1'; // replace with actual user ID
  const chattingWith = '2';   // replace with actual partner ID
  return (
    <Router>
      <ThemeSync />
      <NavBar onRegisterClick={openLogin} />
      <Routes>
        <Route path="/" element={<Home openLogin={openLogin} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/property" element={<PostPropertyForm />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/chat'element={ <ChatBox userId={loggedInUserId} partnerId={chattingWith} />} />
        <Route path="/chat/:partnerId" element={<ChatWrapper />} />
      </Routes>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={closeLogin} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Login onSignupLinkClick={() => {
              closeLogin();
              openSignup();
            }} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={closeSignup} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Register</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SignupStepper />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Router>
  );
};

export default App;

