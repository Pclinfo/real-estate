

// Home.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Input, List, ListItem, Spinner, VStack, HStack, RangeSlider,
  RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Select,
  IconButton, Container, Tabs, TabList, Tab, Text, Grid, Stack, Image,
  useColorModeValue, useBreakpointValue, useToast
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useGetCitiesQuery } from "../services/cityApi";
 
const Home = () => {
  const [cityInput, setCityInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [priceRange, setPriceRange] = useState([10000, 50000]);
  const [selectedTab, setSelectedTab] = useState("RENT");
  const [propertyType, setPropertyType] = useState("");

  const bg = useColorModeValue("white", "gray.800");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const autoCompleteBg = useColorModeValue("white", "gray.700");
  const autoCompleteItemHoverBg = useColorModeValue("gray.100", "gray.600");
  const autoCompleteItemHoverColor = useColorModeValue("black", "white");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(cityInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [cityInput]);

  const { data: cities = [], isFetching } = useGetCitiesQuery(debouncedInput, {
    skip: debouncedInput.length < 2,
  });

  const handleCityClick = (city) => {
    const selectedCity = typeof city === "string" ? city : city?.name || "";
    setCityInput(selectedCity);
    setDebouncedInput(""); // Close dropdown
  };

  const handleSearch = () => {
    if (!cityInput || !propertyType) {
      toast({
        title: "City & Property Type Required",
        status: "error",
        duration: 3000,
        isClosable: true, 
      });
      return;
    }

    navigate(
      `/properties?city=${cityInput}&property_type=${propertyType}&min_price=${priceRange[0]}&max_price=${priceRange[1]}&propertyCategory=${selectedTab.charAt(0) + selectedTab.slice(1).toLowerCase()}`
    );
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} py={8}>
      <Container maxW="5xl" px={4}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
          <Stack spacing={4}>
            <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
              Your next feel-good spot is just around the corner
            </Text>
            <Text fontSize="md" color="gray.600">
              Find the best properties around you at the best prices.
            </Text>
          </Stack>
          <Box textAlign="center">
            <Image
              src="https://bit.ly/dan-abramov"
              alt="Hero"
              borderRadius="xl"
              mx="auto"
              maxH={{ base: "180px", md: "260px" }}
              objectFit="cover"
              boxShadow="lg"
            />
          </Box>
        </Grid>

        <Box bg={bg} p={{ base: 4, md: 6 }} borderRadius="xl" boxShadow="md" mt={10}>
          <Tabs
            isFitted
            colorScheme="blue"
            onChange={(index) => setSelectedTab(["RENT", "BUY", "SELL", "LEASE"][index])}
          >
            <TabList display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={4}>
              {["RENT", "BUY", "SELL", "LEASE"].map((label, idx) => (
                <Tab key={idx}>{label}</Tab>
              ))}
            </TabList>

            <Box>
              {isMobile ? (
                <VStack spacing={4} align="stretch">
                  {/* Mobile - City Input with Autocomplete */}
                  <Box position="relative">
                    <Input
                      placeholder="Enter city"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onBlur={() => setTimeout(() => setDebouncedInput(""), 150)}
                      variant="filled"
                    />
                    {isFetching && <Spinner size="sm" position="absolute" top={2} right={3} />}
                    {debouncedInput.length >= 2 && cities.length > 0 && (
                      <List
                        position="absolute"
                        top="100%"
                        mt={1}
                        bg={autoCompleteBg}
                        w="full"
                        borderRadius="md"
                        boxShadow="md"
                        zIndex="popover"
                        maxH="150px"
                        overflowY="auto"
                      >
                        {cities.map((city, i) => (
                          <ListItem
                            key={i}
                            px={3}
                            py={2}
                            _hover={{ bg: autoCompleteItemHoverBg, color: autoCompleteItemHoverColor }}
                            onClick={() => handleCityClick(city)}
                          >
                            {city.name || city}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>

                  <Select
                    placeholder="Property Type"
                    variant="filled"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Independent House</option>
                    {selectedTab !== "LEASE" && <option>PG/Hostel</option>}
                  </Select>

                  <Box>
                    <Text fontSize="sm" mb={2}>
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Text>
                    <RangeSlider
                      defaultValue={priceRange}
                      min={5000}
                      max={100000}
                      step={1000}
                      onChange={(val) => setPriceRange(val)}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </Box>

                  <IconButton
                    icon={<Search2Icon />}
                    colorScheme="blue"
                    aria-label="Search"
                    width="full"
                    onClick={handleSearch}
                  />
                </VStack>
              ) : (
                <HStack spacing={4}>
                  {/* Desktop - City Input with Autocomplete */}
                  <Box position="relative" w="30%">
                    <Input
                      placeholder="Enter city"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onBlur={() => setTimeout(() => setDebouncedInput(""), 150)}
                      variant="filled"
                    />
                    {isFetching && <Spinner size="sm" position="absolute" top={2} right={3} />}
                    {debouncedInput.length >= 2 && cities.length > 0 && (
                      <List
                        position="absolute"
                        top="100%"
                        mt={1}
                        bg={autoCompleteBg}
                        w="full"
                        borderRadius="md"
                        boxShadow="md"
                        zIndex="popover"
                        maxH="150px"
                        overflowY="auto"
                      >
                        {cities.map((city, i) => (
                          <ListItem
                            key={i}
                            px={3}
                            py={2}
                            _hover={{ bg: autoCompleteItemHoverBg, color: autoCompleteItemHoverColor }}
                            onClick={() => handleCityClick(city)}
                          >
                            {city.name || city}
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Box>

                  <Select
                    placeholder="Property Type"
                    variant="filled"
                    w="20%"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Independent House</option>
                    <option>Plots/Land</option>
                    {selectedTab !== "LEASE" && <option>PG/Hostel</option>}
                  </Select>

                  <Box w="30%">
                    <Text fontSize="sm" mb={1}>
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </Text>
                    <RangeSlider
                      defaultValue={priceRange}
                      min={1000}
                      max={100000}
                      step={1000}
                      onChange={(val) => setPriceRange(val)}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </Box>

                  <IconButton
                    icon={<Search2Icon />}
                    colorScheme="blue"
                    aria-label="Search"
                    onClick={handleSearch}
                  />
                </HStack>
              )}
            </Box>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

