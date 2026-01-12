// client/src/pages/admin/Admin.js
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0 });
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    gender: "",
    category: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch all products + stats
  const fetchData = async () => {
    try {
      const prodRes = await axios.get("http://localhost:8080/admin/products");
      setProducts(prodRes.data);

      const statsRes = await axios.get("http://localhost:8080/admin/stats");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ Add new product
  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:8080/admin/product", newProduct);
      setNewProduct({ title: "", price: "", gender: "", category: "" });
      fetchData();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/admin/product/${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Update product
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8080/admin/product/${editProduct._id}`,
        editProduct
      );
      setEditProduct(null);
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>🛠 Admin Dashboard</Heading>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      <Text fontWeight="bold">Total Products: {stats.totalProducts}</Text>
      <Text fontWeight="bold" mb={4}>
        Total Orders: {stats.totalOrders}
      </Text>

      {/* Add product */}
      <Box my={4} p={4} borderWidth="1px" borderRadius="md">
        <Heading size="md" mb={2}>
          ➕ Add New Product
        </Heading>
        <Input
          placeholder="Title"
          value={newProduct.title}
          onChange={(e) =>
            setNewProduct({ ...newProduct, title: e.target.value })
          }
          mb={2}
        />
        <Input
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          mb={2}
        />
        <Input
          placeholder="Gender"
          value={newProduct.gender}
          onChange={(e) =>
            setNewProduct({ ...newProduct, gender: e.target.value })
          }
          mb={2}
        />
        <Input
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          mb={2}
        />
        <Button colorScheme="teal" onClick={handleAdd}>
          Add Product
        </Button>
      </Box>

      {/* Product list */}
      <Heading size="md" my={4}>
        📦 Product List
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Price</Th>
            <Th>Category</Th>
            <Th>Gender</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <Tr key={p._id}>
                <Td>
                  {editProduct && editProduct._id === p._id ? (
                    <Input
                      value={editProduct.title}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          title: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.title
                  )}
                </Td>
                <Td>
                  {editProduct && editProduct._id === p._id ? (
                    <Input
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    `₹${p.price}`
                  )}
                </Td>
                <Td>
                  {editProduct && editProduct._id === p._id ? (
                    <Input
                      value={editProduct.category}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.category
                  )}
                </Td>
                <Td>
                  {editProduct && editProduct._id === p._id ? (
                    <Input
                      value={editProduct.gender}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          gender: e.target.value,
                        })
                      }
                    />
                  ) : (
                    p.gender
                  )}
                </Td>
                <Td>
                  {editProduct && editProduct._id === p._id ? (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={handleUpdate}
                      mr={2}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setEditProduct(p)}
                      mr={2}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5" textAlign="center">
                No products found
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
