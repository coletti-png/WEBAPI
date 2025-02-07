const favoritethingsContainer = document.getElementById("favoritethings-container");

const fetchFavoritethings = async () => {
  try {
    const response = await fetch("/favoritethings");
    if (!response.ok) {
      throw new Error("Failed to get favorite things");
    }
    const favoritethings = await response.json();
    favoritethingsContainer.innerHTML = "";
    favoritethings.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "favoritething";
      itemDiv.innerHTML = `
        <h3>${item.favoritething}</h3>
        <button class="update-btn" data-id="${item._id}">Update</button>
        <button class="delete-btn" data-id="${item._id}">Delete</button>
      `;
      favoritethingsContainer.appendChild(itemDiv);
    });
    attachEventListeners();
  } catch (error) {
    console.error("Error: ", error);
    favoritethingsContainer.innerHTML = "<p style='color:red'>Failed to get favorite things</p>";
  }
};

const attachEventListeners = () => {
  document.querySelectorAll(".update-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const newName = prompt("Enter new name for your favorite thing:");
      if (newName) {
        updateItem(id, newName);
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this item?")) {
        deleteItem(id);
      }
    });
  });
};

const updateItem = async (id, newName) => {
  try {
    const response = await fetch(`/updatefavoritething/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favoritething: newName }),
    });
    if (response.ok) {
      alert("Item updated successfully!");
      fetchFavoritethings(); 
    } else {
      alert("Failed to update item.");
    }
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

const deleteItem = async (id) => {
  try {
    const response = await fetch(`/deletefavoritething/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Item deleted successfully!");
      fetchFavoritethings(); 
    } else {
      alert("Failed to delete item.");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

fetchFavoritethings();
