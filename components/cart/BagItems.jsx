import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ItemBox } from "./ItemBox";

export const BagItems = () => {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(cart);
  }, []);

  return (
    <Box>
      <Text mb={"20px"} fontSize={"20px"} fontWeight={600}>
        Bag
      </Text>

      {cartProducts.map((item, index) => (
        <ItemBox key={index} {...item} index={index} data={item} />
      ))}
    </Box>
  );
};
