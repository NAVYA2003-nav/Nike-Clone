import { Box, Flex, Image, Spacer, Text, Button, Select } from "@chakra-ui/react";
import { AiOutlineStar } from "react-icons/ai";
import { numberWithCommas, shortString } from "../../utils/extraFunctions";
import { DescText, PriceText } from "./DescText";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProductDisplayBox = ({ 
  id, title, description, color, rating, price, size, gender, img 
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }

    const payload = {
      productId: id,
      title,
      price,
      img,
      color,
      gender,
      size: selectedSize,
      quantity: 1,
    };

    // ✅ Save product to localStorage cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(payload);
    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Navigate directly to Cart page
    navigate("/cart");
  };

  return (
    <Flex flexDirection="column" mb="10px" borderWidth={1} borderRadius="md" p={2}>
      <Box overflow="hidden">
        <Image className="imgAnimation" src={img[0]} alt={title} />
      </Box>
      <Box mt={2}>
        <Flex justifyItems="center">
          <Text
            fontSize={['13px','15px','17px','17px','18px']}
            fontWeight={600}
          >
            {shortString(title)}
          </Text>
          <Spacer />
          <Box fontSize={['13px','15px','17px','17px','18px']} mr="3px" mt="4px">
            <AiOutlineStar />
          </Box>
          <Text fontSize={['13px','15px','17px','17px','18px']}>{rating}</Text>
        </Flex>

        <DescText>{shortString(description, 20)}</DescText>

        {size && size.length > 0 && (
          <Select
            placeholder="Select size"
            mt={2}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {size.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}

        <DescText>{gender}, {color} Colour</DescText>
        <PriceText>₹{numberWithCommas(price)}.00</PriceText>

        {/* ✅ Prevents navigation to description on button click */}
        <Button
          mt={3}
          colorScheme="teal"
          width="full"
          onClick={(e) => {
            e.stopPropagation();  // ⛔ prevent parent click
            handleAdd();
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Flex>
  );
};
