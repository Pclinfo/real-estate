

// import React, { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   Box,
//   Spinner,
//   SimpleGrid,
//   Card,
//   CardBody,
//   Heading,
//   Text,
//   Container,
//   Image,
//   HStack,
//   IconButton,
//   useColorModeValue,
//   Flex,
//   Button,
//   useToast,
// } from "@chakra-ui/react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import { useSelector } from "react-redux";
// import FiltersSidebar from "./FiltersSidebar";
// import {
//   useGetFilteredPropertiesQuery,
//   useToggleLikePropertyMutation,
// } from "../services/propertyApi";

// const CombinedPropertyList = () => {
//   const [searchParams] = useSearchParams();

  
//   const city = searchParams.get("city");
//   const property_type = searchParams.get("property_type");
//   const min_price = searchParams.get("min_price");
//   const max_price = searchParams.get("max_price");
//   const propertyCategory = searchParams.get("propertyCategory");
//   const postedBy = searchParams.get("postedBy");
// const userId = useSelector((state) => state.user.user?.user_id);
//   const { data, isFetching } = useGetFilteredPropertiesQuery({
//     city,
//     property_type,
//     budget_min: min_price,
//     budget_max: max_price,
//     propertyCategory,
//     postedBy,
//      user_id: userId, 
//   });

//   const properties = data?.properties || [];

//   return (
//     <Container maxW="7xl" py={{ base: 6, md: 10 }}>
//       <Heading size="lg" mb={5} color="blue.500">
//         {propertyCategory ? `${propertyCategory} Properties` : "All Properties"}
//       </Heading>

//       <Flex direction={{ base: "column", md: "row" }} gap={6}>
//         <Box flexBasis={{ base: "100%", md: "25%" }}>
//           <FiltersSidebar />
//         </Box>

//         <Box flex="1">
//           {isFetching ? (
//             <Flex justify="center" align="center" minH="200px">
//               <Spinner size="xl" color="teal.500" />
//             </Flex>
//           ) : (
//             <SimpleGrid
//               columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
//               spacing={{ base: 4, md: 6 }}
//             >
//               {properties.length > 0 ? (
//                 properties.map((property) => (
//                   <PropertyCard key={property.id} property={property} />
//                 ))
//               ) : (
//                 <Text color="gray.500" textAlign="center">
//                   No properties found.
//                 </Text>
//               )}
//             </SimpleGrid>
//           )}
//         </Box>
//       </Flex>
//     </Container>
//   );
// };

// const PropertyCard = ({ property }) => {
//   const toast = useToast();
//  const user= useSelector((state) => state.user.user);
//   const [toggleLike] = useToggleLikePropertyMutation();

//   const photos = Array.isArray(property.photos) ? property.photos : [];
//   const [current, setCurrent] = useState(0);
//   const [likesCount, setLikesCount] = useState(property.likes || 0);
//   const [liked, setLiked] = useState(property.likedByCurrentUser || false);

//   const nextPhoto = () => setCurrent((prev) => (prev + 1) % photos.length);
//   const prevPhoto = () => setCurrent((prev) => (prev - 1 + photos.length) % photos.length);

//  const handleLikeToggle = async () => {
  
//   if (!user?.user_id) {
//     toast({
//       title: "Login Required",
//       description: "Please login to like this property.",
//       status: "warning",
//       duration: 3000,
//       isClosable: true,
//       position: "top",
//     });
//     return;
//   }
 
//   // ✅ Optimistically update UI
//   const prevLiked = liked;
//   const prevLikesCount = likesCount;

//   setLiked(!liked);
//   setLikesCount((count) => (liked ? count - 1 : count + 1));

//   try {
//     const res = await toggleLike({
//       propertyId: property.id,
//       userId: user.user_id,
//     }).unwrap();

//     // Optional: Update if server returned something different
//     setLiked(res.likedByCurrentUser);
//     setLikesCount(res.likes);
//   } catch (error) {
//     console.error("Failed to toggle like", error);

//     // ⛔ Revert optimistic update on failure
//     setLiked(prevLiked);
//     setLikesCount(prevLikesCount);

//     toast({
//       title: "Error",
//       description: "Could not update like.",
//       status: "error",
//       duration: 3000,
//       isClosable: true,
//       position: "top",
//     });
//   }
// };


//   let locationArray = [];
//   if (property.location) {
//     try {
//       if (typeof property.location === "string" && property.location.includes("[")) {
//         locationArray = JSON.parse(property.location);
//       } else if (typeof property.location === "string") {
//         locationArray = property.location.split(",");
//       } else if (Array.isArray(property.location)) {
//         locationArray = property.location;
//       }
//     } catch {
//       locationArray = ["Invalid location"];
//     }
//   }

//   const cardBg = useColorModeValue("white", "gray.700");
//   const cardShadow = useColorModeValue("md", "dark-lg");

//   return (
//     <Card
//       bg={cardBg}
//       boxShadow={cardShadow}
//       borderRadius="xl"
//       overflow="hidden"
//       transition="all 0.3s"
//       _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
//     >
//       <CardBody p={0}>
//         {photos.length > 0 ? (
//           <Box position="relative">
//             <Image
//               src={`http://localhost:8000/uploads/properties/${photos[current]}`}
//               alt={`Property ${current + 1}`}
//               w="100%"
//               h={{ base: "180px", sm: "200px", md: "220px" }}
//               objectFit="cover"
//             />
//             <HStack
//               justify="space-between"
//               position="absolute"
//               top="50%"
//               w="100%"
//               px={2}
//               transform="translateY(-50%)"
//             >
//               <IconButton
//                 aria-label="Prev"
//                 icon={<ChevronLeftIcon />}
//                 onClick={prevPhoto}
//                 isDisabled={photos.length <= 1}
//                 size="xs"
//                 bg="blackAlpha.500"
//                 color="white"
//                 _hover={{ bg: "blackAlpha.700" }}
//               />
//               <IconButton
//                 aria-label="Next"
//                 icon={<ChevronRightIcon />}
//                 onClick={nextPhoto}
//                 isDisabled={photos.length <= 1}
//                 size="xs"
//                 bg="blackAlpha.500"
//                 color="white"
//                 _hover={{ bg: "blackAlpha.700" }}
//               />
//             </HStack>
//           </Box>
//         ) : (
//           <Text p={4} color="gray.500" fontSize="sm">
//             No images available
//           </Text>
//         )}

//         <Box p={3}>
//           <Heading fontSize="md" mb={1} color="blue.500">
//             {locationArray[0]?.trim() || "Unknown Location"}
//           </Heading>
//           <Text fontSize="sm" fontWeight="bold" color="blue.600">
//             ₹ {property.price || property.budget || "NA"}
//           </Text>
//           <Text fontSize="xs" color="gray.500">
//             Type: {property.property_type}
//           </Text>
//           <Text fontSize="xs" color="gray.500" noOfLines={1}>
//             {locationArray.map((l) => l.trim()).join(", ")}
//           </Text>

//           <Flex mt={3} align="center" justify="space-between">
//             <Button
//               size="sm"
//               leftIcon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
//               onClick={(e) => {
//     e.preventDefault(); // ✅ extra protection
//     handleLikeToggle();
//   }}
//               colorScheme={liked ? "red" : "gray"}
//               variant="ghost"
//             >
//               {likesCount}
//             </Button>
//              <Button
//     size="sm"
//     colorScheme="blue"
//     variant="solid"
//     onClick={() => {
//       toast({
//         title: "Contact Clicked",
//         description: `Contacting owner of property ID ${property.id}`,
//         status: "info",
//         duration: 2000,
//         isClosable: true,
//         position: "top",
//       });
//     }}
//   >
//    Send Message
//   </Button>
//   <Button
//     size="sm"
//     colorScheme="blue"
//     variant="solid"
//     onClick={() => {
//       toast({
//         title: "Contact Clicked",
//         description: `Contacting owner of property ID ${property.id}`,
//         status: "info",
//         duration: 2000,
//         isClosable: true,
//         position: "top",
//       });
//     }}
//   >
//     Book a Shedule
//   </Button>
   
//           </Flex>
//         </Box>
//       </CardBody>
//     </Card>
//   );
// };

// export default CombinedPropertyList;

// CombinedPropertyList.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import {
  Box,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  Container,
  Image,
  HStack,
  IconButton,
  useColorModeValue,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import FiltersSidebar from "./FiltersSidebar";
import {
  useGetFilteredPropertiesQuery,
  useToggleLikePropertyMutation,
} from "../services/propertyApi";

const CombinedPropertyList = () => {
  const [searchParams] = useSearchParams();

  const city = searchParams.get("city");
  const property_type = searchParams.get("property_type");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const propertyCategory = searchParams.get("propertyCategory");
  const postedBy = searchParams.get("postedBy");

  const userId = useSelector((state) => state.user.user?.user_id);
  const { data, isFetching } = useGetFilteredPropertiesQuery({
    city,
    property_type,
    budget_min: min_price,
    budget_max: max_price,
    propertyCategory,
    postedBy,
    user_id: userId,
  });

  const properties = data?.properties || [];

  return (
    <Container maxW="7xl" py={{ base: 6, md: 10 }}>
      <Heading size="lg" mb={5} color="blue.500">
        {propertyCategory ? `${propertyCategory} Properties` : "All Properties"}
      </Heading>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box flexBasis={{ base: "100%", md: "25%" }}>
          <FiltersSidebar />
        </Box>

        <Box flex="1">
          {isFetching ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" color="teal.500" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={{ base: 4, md: 6 }}>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <Text color="gray.500" textAlign="center">
                  No properties found.
                </Text>
              )}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

const PropertyCard = ({ property }) => {
  const toast = useToast();
  const user = useSelector((state) => state.user.user);
  const [toggleLike] = useToggleLikePropertyMutation();
  const navigate = useNavigate(); // ✅ navigation

  const photos = Array.isArray(property.photos) ? property.photos : [];
  const [current, setCurrent] = useState(0);
  const [likesCount, setLikesCount] = useState(property.likes || 0);
  const [liked, setLiked] = useState(property.likedByCurrentUser || false);

  const nextPhoto = () => setCurrent((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrent((prev) => (prev - 1 + photos.length) % photos.length);

  const handleLikeToggle = async () => {
    if (!user?.user_id) {
      toast({
        title: "Login Required",
        description: "Please login to like this property.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const prevLiked = liked;
    const prevLikesCount = likesCount;

    setLiked(!liked);
    setLikesCount((count) => (liked ? count - 1 : count + 1));

    try {
      const res = await toggleLike({
        propertyId: property.id,
        userId: user.user_id,
      }).unwrap();

      setLiked(res.likedByCurrentUser);
      setLikesCount(res.likes);
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevLikesCount);
      toast({
        title: "Error",
        description: "Could not update like.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  let locationArray = [];
  if (property.location) {
    try {
      if (typeof property.location === "string" && property.location.includes("[")) {
        locationArray = JSON.parse(property.location);
      } else if (typeof property.location === "string") {
        locationArray = property.location.split(",");
      } else if (Array.isArray(property.location)) {
        locationArray = property.location;
      }
    } catch {
      locationArray = ["Invalid location"];
    }
  }

  const cardBg = useColorModeValue("white", "gray.700");
  const cardShadow = useColorModeValue("md", "dark-lg");

  return (
    <Card bg={cardBg} boxShadow={cardShadow} borderRadius="xl" overflow="hidden" transition="all 0.3s" _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}>
      <CardBody p={0}>
        {photos.length > 0 ? (
          <Box position="relative">
            <Image
              src={`http://localhost:8000/uploads/properties/${photos[current]}`}
              alt={`Property ${current + 1}`}
              w="100%"
              h={{ base: "180px", sm: "200px", md: "220px" }}
              objectFit="cover"
            />
            <HStack justify="space-between" position="absolute" top="50%" w="100%" px={2} transform="translateY(-50%)">
              <IconButton aria-label="Prev" icon={<ChevronLeftIcon />} onClick={prevPhoto} isDisabled={photos.length <= 1} size="xs" bg="blackAlpha.500" color="white" _hover={{ bg: "blackAlpha.700" }} />
              <IconButton aria-label="Next" icon={<ChevronRightIcon />} onClick={nextPhoto} isDisabled={photos.length <= 1} size="xs" bg="blackAlpha.500" color="white" _hover={{ bg: "blackAlpha.700" }} />
            </HStack>
          </Box>
        ) : (
          <Text p={4} color="gray.500" fontSize="sm">
            No images available
          </Text>
        )}

        <Box p={3}>
          <Heading fontSize="md" mb={1} color="blue.500">
            {locationArray[0]?.trim() || "Unknown Location"}
          </Heading>
          <Text fontSize="sm" fontWeight="bold" color="blue.600">
            ₹ {property.price || property.budget || "NA"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Type: {property.property_type}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {locationArray.map((l) => l.trim()).join(", ")}
          </Text>

          <Flex mt={3} align="center" justify="space-between" gap={2}>
            <Button
              size="sm"
              leftIcon={liked ? <AiFillHeart /> : <AiOutlineHeart />}
              onClick={(e) => {
                e.preventDefault();
                handleLikeToggle();
              }}
              colorScheme={liked ? "red" : "gray"}
              variant="ghost"
            >
              {likesCount}
            </Button>

            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => {
                if (!user?.user_id) {
                  toast({
                    title: "Login Required",
                    description: "Please login to send a message.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                  });
                  return;
                }

                // ✅ Navigate to chat page with property owner's ID
                navigate(`/chat/${property.owner_id}`);
              }}
            >
              Send Message
            </Button>

            <Button
              size="sm"
              colorScheme="blue"
              onClick={() =>
                toast({
                  title: "Book a Schedule",
                  description: `Booking request for property ID ${property.id}`,
                  status: "info",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                })
              }
            >
              Book a Schedule
            </Button>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};

export default CombinedPropertyList;
