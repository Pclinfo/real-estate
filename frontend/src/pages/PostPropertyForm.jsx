

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  useToast,
  List,
  ListItem,
  Spinner,
  useColorModeValue,
  Checkbox,
  CheckboxGroup,
  Stack,
  Badge,
  HStack,
  IconButton,
  Image,
  SimpleGrid
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useCreatePropertyMutation } from '../services/propertyApi';
import { useGetCitiesQuery } from '../services/cityApi';

const CreateProperty = () => {
  const [form, setForm] = useState({
    location: '',
    property_type: '',
    budget: '',
    posted_by: '',
    photos: [],
    sharing: '',
    area: '',
    propertyCategory: ''
  });

  const [bedroomInput, setBedroomInput] = useState('');
  const [bedroomList, setBedroomList] = useState([]);
  const [locationQuery, setLocationQuery] = useState('');
  const toast = useToast();

  const dropdownBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const itemTextColor = useColorModeValue('gray.700', 'gray.200');
  const itemHoverBg = useColorModeValue('blue.50', 'blue.700');
  const itemHoverText = useColorModeValue('blue.800', 'white');

  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery(locationQuery, {
    skip: !locationQuery || locationQuery.length < 2
  });

  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'location') setLocationQuery(value);
  };

  const handleSelectCity = (cityName) => {
    setForm((prev) => ({ ...prev, location: cityName }));
    setLocationQuery('');
  };

  const handleAddBedroom = () => {
    const value = bedroomInput.trim();
    if (value && !bedroomList.includes(value)) {
      setBedroomList((prev) => [...prev, value]);
      setBedroomInput('');
    }
  };

  const handleRemoveBedroom = (value) => {
    setBedroomList(bedroomList.filter((item) => item !== value));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const handleRemovePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('location', form.location);
      formData.append('property_type', form.property_type);
      formData.append('budget', form.budget);
      formData.append('posted_by', JSON.stringify(form.posted_by.split(',').map((s) => s.trim())));
      formData.append('propertyCategory', form.propertyCategory);

      if (form.property_type !== 'Plots/Land') {
        formData.append('bedrooms', JSON.stringify(bedroomList));
      }

      if (form.property_type === 'PG/Hostel') {
        formData.append('sharing', JSON.stringify(form.sharing.split(',').map((s) => s.trim())));
      }

      if (form.property_type === 'Plots/Land') {
        formData.append('area', form.area);
      }

      form.photos.forEach((file) => {
        formData.append('photos', file);
      });

      await createProperty(formData).unwrap();
      toast({
        title: 'Property posted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });

      setForm({
        location: '',
        property_type: '',
        budget: '',
        posted_by: '',
        photos: [],
        sharing: '',
        area: '',
        propertyCategory: ''
      });
      setBedroomList([]);
      setBedroomInput('');
    } catch (error) {
      toast({
        title: 'Error posting property',
        description: error?.data?.error || 'Something went wrong.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const showSharing = form.property_type === 'PG/Hostel';
  const showArea = form.property_type === 'Plots/Land';
  const showBedrooms = form.property_type !== 'Plots/Land';

  return (
    <Box p={6} maxW="900px" mx="auto" borderWidth="1px" borderRadius="md" boxShadow="md">
      <VStack spacing={5} align="stretch" position="relative">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Start typing city name"
              autoComplete="off"
            />
            {isCitiesLoading && <Spinner size="sm" mt={2} />}
            {locationQuery && cities?.length > 0 && (
              <Box
                position="absolute"
                top="100%"
                left={0}
                width="100%"
                bg={dropdownBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                mt={1}
                zIndex={10}
                maxH="200px"
                overflowY="auto"
                boxShadow="lg"
              >
                <List spacing={0}>
                  {cities.map((city) => (
                    <ListItem
                      key={city.id}
                      px={4}
                      py={2}
                      color={itemTextColor}
                      _hover={{ bg: itemHoverBg, color: itemHoverText }}
                      cursor="pointer"
                      onClick={() =>
                        handleSelectCity(`${city.name}, ${city.state}, ${city.country}`)
                      }
                    >
                      {city.name}, {city.state}, {city.country}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Property Type</FormLabel>
            <Select
              name="property_type"
              value={form.property_type}
              onChange={handleChange}
              placeholder="Select property type"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Plots/Land">Plots/Land</option>
              <option value="PG/Hostel">PG/Hostel</option>
            </Select>
          </FormControl>

          {showSharing && (
            <FormControl>
              <FormLabel>Sharing (comma-separated)</FormLabel>
              <Input
                name="sharing"
                value={form.sharing}
                onChange={handleChange}
                placeholder="e.g., 1,2,3"
              />
            </FormControl>
          )}

          {showArea && (
            <FormControl>
              <FormLabel>Area</FormLabel>
              <Input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="e.g., 2400 sqft"
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Budget</FormLabel>
            <Input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g., 5000000"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Property Category</FormLabel>
            <Select
              name="propertyCategory"
              value={form.propertyCategory}
              onChange={handleChange}
              placeholder="Select category"
            >
              <option value="Rent">Rent</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
              <option value="Lease">Lease</option>
            </Select>
          </FormControl>
        </SimpleGrid>

        {/* Bedrooms */}
        {showBedrooms && (
          <FormControl>
            <FormLabel>Bedrooms</FormLabel>
            <HStack>
              <Input
                type="text"
                placeholder="e.g., 1BHK"
                value={bedroomInput}
                onChange={(e) => setBedroomInput(e.target.value)}
              />
              <Button onClick={handleAddBedroom}>Enter</Button>
            </HStack>
            <HStack spacing={2} mt={2} flexWrap="wrap">
              {bedroomList.map((item, idx) => (
                <Badge key={idx} colorScheme="blue" px={2} py={1} borderRadius="lg">
                  {item}
                  <IconButton
                    icon={<CloseIcon fontSize="10px" />}
                    size="xs"
                    ml={2}
                    onClick={() => handleRemoveBedroom(item)}
                    variant="ghost"
                    aria-label="remove"
                  />
                </Badge>
              ))}
            </HStack>
          </FormControl>
        )}

        {/* Posted By */}
        <FormControl>
          <FormLabel>Posted By</FormLabel>
          <CheckboxGroup
            value={form.posted_by.split(',').map((s) => s.trim())}
            onChange={(values) =>
              setForm((prev) => ({ ...prev, posted_by: values.join(', ') }))
            }
          >
            <Stack spacing={2} direction="column">
              <Checkbox value="Owner">Owner</Checkbox>
              <Checkbox value="Dealer">Dealer</Checkbox>
              <Checkbox value="Builder">Builder</Checkbox>
              <Checkbox value="Broker">Broker</Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>

        {/* Photos */}
        <FormControl>
          <FormLabel>Photos</FormLabel>
          <Input type="file" accept="image/*" multiple onChange={handlePhotoUpload} required />
          <Box display="flex" flexWrap="wrap" gap={3} mt={3}>
            {form.photos.map((file, index) => (
              <Box key={index} position="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`photo-${index}`}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <IconButton
                  size="xs"
                  icon={<CloseIcon />}
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  colorScheme="red"
                  borderRadius="full"
                  onClick={() => handleRemovePhoto(index)}
                  aria-label="remove image"
                />
              </Box>
            ))}
          </Box>
        </FormControl>

        <Button
          colorScheme="blue"
          width="full"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Submit Property
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateProperty;
