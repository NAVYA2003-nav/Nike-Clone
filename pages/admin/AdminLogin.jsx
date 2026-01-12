import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Heading } from "@chakra-ui/react";
import { GET_TOKEN } from "../../redux/features/auth/actionTypes"; // adjust path

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      const token = "admin-token";
      const user = { name: "Admin", role: "admin" };

      // Save to localStorage if needed
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: GET_TOKEN,
        payload: { token, user }
      });

      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Admin Login</Heading>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mb={2}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={4}
      />
      <Button colorScheme="teal" onClick={handleLogin}>Login</Button>
    </Box>
  );
};
