

// components/FiltersSidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

const FiltersSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [category, setCategory] = useState(searchParams.get("propertyCategory") || "");
  const [postedBy, setPostedBy] = useState(searchParams.get("postedBy") || "");
  const [selectedTab] = useState("RENT");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleApplyFilters = () => {
    const params = {};

    if (city) params.city = city;
    if (propertyType) params.property_type = propertyType;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (category) params.propertyCategory = category;
    if (postedBy) params.postedBy = postedBy;

    setSearchParams(params); // 🔥 updates the URL, triggers query re-fetch
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
    >
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
        </FormControl>

        <FormControl>
          <FormLabel>Property Type</FormLabel>
          <Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Any</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Independent House">Independent House</option>
            {selectedTab !== "LEASE" && <option value="PG/Hostel">PG/Hostel</option>}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Min Price</FormLabel>
          <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Max Price</FormLabel>
          <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Any</option>
            <option value="Rent">Rent</option>
            <option value="Sell">Sell</option>
            <option value="Buy">Buy</option>
            <option value="Lease">Lease</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Posted By</FormLabel>
          <Select value={postedBy} onChange={(e) => setPostedBy(e.target.value)}>
            <option value="">Any</option>
            <option value="Owner">Owner</option>
            <option value="Dealer">Dealer</option>
            <option value="Builder">Builder</option>
            <option value="Broker">Broker</option>
          </Select>
        </FormControl>

        <Button colorScheme="blue" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Stack>
    </Box>
  );
};

export default FiltersSidebar;
