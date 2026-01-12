import { Box, Divider, Grid, ListItem, Text, UnorderedList, useToast, Spinner, Center, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { numberWithCommas, setToast } from "../../utils/extraFunctions";
import { ImageModal } from "../../components/description/ImageModal";
import { SelectSize } from "../../components/description/SelectSize";
import { NewButton } from "../../components/description/NewButton";
import { getItemSession } from "../../utils/sessionStorage";
import { addToCartRequest } from "../../redux/features/cart/actions";
import { useState, useEffect } from "react";
import { addToFavouriteRequest } from "../../redux/features/favourite/actions";
import { useNavigate, useParams } from "react-router-dom";

export const Description = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mySize, setMySize] = useState(null);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      if (!id) return;

      const res = await fetch(`http://localhost:8080/allProducts/${id}`);
      const data = await res.json();

      // 🔑 Handle if API sends array or object
      if (Array.isArray(data)) {
        const found = data.find((p) => p._id === id);
        setProduct(found || null);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error("❌ Fetch error:", error.message);
      const sessionProduct = getItemSession("singleProduct");
      setProduct(sessionProduct || null);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);


  // ✅ Loading state
  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  // ✅ Not found state
  if (!product) {
    return (
      <Center flexDir="column" h="60vh" gap={4}>
        <Text fontSize="2xl" fontWeight="bold" color="red.500">
          ⚠️ Product not found
        </Text>
        <Button onClick={() => window.location.href = "/allProducts"} colorScheme="blue">
          Back to Products
        </Button>
      </Center>
    );
  }

  // ✅ Destructure safely
  const { name, title, gender, description, category, price, size, color, rating, image, img, _id } = product;
  const displayTitle = title || name || "No Title";
  const displayImage = img || image || "https://via.placeholder.com/400x400?text=No+Image";

  const token = useSelector((state) => state.authReducer.token);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!mySize) {
      setToast(toast, "Please select a Size", "error");
    } else {
      const payload = {
        productId: _id || id,
        size: mySize,
        quantity: 1,
      };
      dispatch(addToCartRequest(payload, toast));
    }
  };

  // ✅ Add to Favourite
  const handleAddToFavourite = () => {
    if (!token) {
      setToast(toast, "Please login first", "error");
      navigate("/auth");
    } else {
      const payload = { productId: _id || id };
      dispatch(addToFavouriteRequest(payload, token, toast));
    }
  };

  return (
    <Grid
      p="10px"
      gap={["40px", "40px", "4%", "4%", "4%"]}
      templateColumns={["100%", "100%", "55% 41%", "62% 34%", "62% 34%"]}
      w={["100%", "100%", "100%", "100%", "90%"]}
      m={["40px auto 100px", "40px auto 100px", "40px auto 60px", "40px auto 60px", "40px auto 60px"]}
    >
      {/* Product Image */}
      <ImageModal img={displayImage} />

      {/* Product Details */}
      <Box px={["20px", "40px"]}>
        <Text fontSize="2xl" fontWeight="bold">{displayTitle}</Text>
        <Text mt={2}>{description || "No description available."}</Text>
        <Text fontSize="lg" mt="20px" fontWeight="bold">
          ₹ {numberWithCommas(price || 0)}
        </Text>
        <Text fontSize="sm" color="gray">
          incl. of taxes and duties
        </Text>

        {/* Size selection */}
        <Text fontSize="md" mt="30px" mb="10px">
          Select Size
        </Text>
        <Box mb="30px">
          <SelectSize size={size || []} setMySize={setMySize} />
        </Box>

        {/* Buttons */}
        <NewButton
          click={handleAddToCart}
          name="Add to Bag"
          bgColor="black"
          color="white"
          hoverBg="#1e1e1e"
          borderColor="transparent"
        />
        <NewButton
          click={handleAddToFavourite}
          name="Favourite"
          bgColor="white"
          color="black"
          hoverBorder="black"
          borderColor="#cecdce"
        />

        <Divider my="30px" />

        {/* Extra Info */}
        <Text fontSize="md" mb="10px" textDecoration="underline">
          Product Details
        </Text>
        <UnorderedList fontSize="md">
          <ListItem>Gender: {gender || "Unisex"}</ListItem>
          <ListItem>Category: {category || "N/A"}</ListItem>
          <ListItem>Colour: {color || "N/A"}</ListItem>
          <ListItem>Rating: {rating || "N/A"}</ListItem>
        </UnorderedList>
      </Box>
    </Grid>
  );
};
