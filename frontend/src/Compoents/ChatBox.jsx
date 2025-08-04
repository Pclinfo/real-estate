import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Input,
  Button,
  Flex,
  Avatar,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from '../features/socketSlice';
import {
  useSendMessageMutation,
  useGetMessagesQuery,
} from '../services/messageApi';

const socketURL = 'http://localhost:8000';

const ChatBox = ({ userId, partnerId, partnerProfileImage }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const scrollRef = useRef(null);

  const { data: messagesData } = useGetMessagesQuery({ userId, partnerId });
  const [sendMessageAPI] = useSendMessageMutation();
  const socket = useSelector((state) => state.socket.socket);

  // Establish Socket connection
  useEffect(() => {
    const newSocket = io(socketURL);
    dispatch(setSocket(newSocket));

    newSocket.on('receive_message', (data) => {
      setAllMessages((prev) => [...prev, data]);
    });

    return () => newSocket.disconnect();
  }, [dispatch]);

  // Load initial messages
  useEffect(() => {
    if (messagesData) setAllMessages(messagesData);
  }, [messagesData]);

  // Scroll to last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSend = async () => {
    if (!message && !media) return;

    const formData = new FormData();
    formData.append('senderId', userId);
    formData.append('receiverId', partnerId);
    formData.append('text', message);
    if (media) formData.append('media', media);

    const res = await sendMessageAPI(formData);

    if (res?.data) {
      socket.emit('send_message', res.data);
      setMessage('');
      setMedia(null);
    }
  };

  return (
    <Flex direction="column" h="100vh" maxH="100vh">
      {/* Header */}
      <Box
        bg={useColorModeValue('teal.500', 'teal.600')}
        p={4}
        color="white"
        boxShadow="sm"
      >
        <HStack spacing={3}>
          <Avatar size="sm" src={partnerProfileImage} name="Partner" />
          <Text fontWeight="bold" fontSize="lg">
            Chat with Partner
          </Text>
        </HStack>
      </Box>

      {/* Messages */}
      <VStack
        spacing={3}
        px={4}
        py={2}
        overflowY="auto"
        flex="1"
        align="stretch"
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        {allMessages.map((msg, i) => {
          const isUser = msg.senderId === userId;
          const bubbleColor = useColorModeValue(
            isUser ? 'teal.100' : 'gray.300',
            isUser ? 'teal.700' : 'gray.600'
          );

          return (
            <Flex
              key={i}
              alignSelf={isUser ? 'flex-end' : 'flex-start'}
              bg={bubbleColor}
              p={3}
              borderRadius="lg"
              maxW="75%"
              direction="column"
              boxShadow="base"
              wordBreak="break-word"
            >
              <Text color={useColorModeValue('gray.800', 'white')}>
                {msg.text}
              </Text>

              {msg.media && (
                <Box mt={2}>
                  {msg.media.endsWith('.jpg') ||
                  msg.media.endsWith('.jpeg') ||
                  msg.media.endsWith('.png') ? (
                    <img
                      src={`http://localhost:5000/uploads/messages/${msg.media}`}
                      alt="media"
                      style={{
                        width: '200px',
                        borderRadius: '10px',
                      }}
                    />
                  ) : (
                    <video
                      src={`http://localhost:5000/uploads/messages/${msg.media}`}
                      width="200"
                      controls
                      style={{ borderRadius: '10px' }}
                    />
                  )}
                </Box>
              )}
            </Flex>
          );
        })}
        <div ref={scrollRef} />
      </VStack>

      {/* Input Section */}
      <Flex
        p={3}
        gap={2}
        bg={useColorModeValue('white', 'gray.900')}
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align="center"
        wrap="wrap"
      >
        <Input
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          bg={useColorModeValue('gray.100', 'gray.700')}
          flex={1}
          size="md"
          _focus={{ bg: useColorModeValue('white', 'gray.800') }}
        />

        <Input
          type="file"
          display="none"
          id="media-upload"
          onChange={(e) => setMedia(e.target.files[0])}
        />
        <label htmlFor="media-upload">
          <IconButton
            icon={<AttachmentIcon />}
            as="span"
            variant="ghost"
            aria-label="Attach file"
            colorScheme="teal"
          />
        </label>

        <Button colorScheme="teal" onClick={handleSend}>
          Send
        </Button>
      </Flex>
    </Flex>
  );
};

export default ChatBox;
