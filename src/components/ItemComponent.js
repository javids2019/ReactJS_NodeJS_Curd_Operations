import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

// Set up Axios interceptors
axios.interceptors.request.use(
  (config) => {
    // Add token to headers
    const token = localStorage.getItem("token") || "Sample Token";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error("Error in response:", error);
    return Promise.reject(error);
  }
);

const ItemComponent = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [editItem, setEditItem] = useState(null);
  // Fetch all items
  useEffect(() => {
    axios
      .get("http://localhost:3000/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  // Add a new item
  const addItem = () => {
    axios
      .post("http://localhost:3000/items", newItem)
      .then((response) => {
        setItems([...items, response.data]);
        setNewItem({ name: "", description: "", price: 0 });
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  // Update an item
  const updateItem = () => {
    axios
      .put(`http://localhost:3000/items/${editItem._id}`, editItem)
      .then((response) => {
        setItems(
          items.map((item) =>
            item._id === editItem._id ? response.data : item
          )
        );
        setEditItem(null);
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  // Delete an item
  const deleteItem = (id) => {
    axios
      .delete(`http://localhost:3000/items/${id}`)
      .then(() => {
        setItems(items.filter((item) => item._id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  // Render items and provide a form to add new items
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.description} - ${item.price}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
            <button onClick={() => setEditItem(item)}>Edit</button>
          </li>
        ))}
      </ul>
      <h2>Add a New Item</h2>
      <input
        type="text"
        placeholder="Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newItem.description}
        onChange={(e) =>
          setNewItem({ ...newItem, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Price"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      />
      <button onClick={addItem}>Add Item</button>
      {editItem && (
        <Fragment>
          <hr />
          <div>
            <h2>Edit Item</h2>
            <input
              type="text"
              placeholder="Name"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: e.target.value })
              }
            />
            <button onClick={updateItem}>Update Item</button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ItemComponent;
