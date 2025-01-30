const ItemDataContainer = document.getElementById("items-container");
const fetchItemData = async () => {
    try {
        const response = await fetch("/ItemData");
        console.log("Response status:", response.status); // Log response status
        if (!response.ok) {
            throw new Error("Failed to get items");
        }
        const ItemData = await response.json();
        console.log("Fetched ItemData:", ItemData); // Log the fetched data
        ItemDataContainer.innerHTML = "";
        ItemData.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "ItemData";
            itemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <button onclick="updateItem('${item._id}')">Update</button>
                <button onclick="deleteItem('${item._id}')">Delete</button>
            `;
            ItemDataContainer.appendChild(itemDiv);
        });
        attachEventListeners();
    } catch (error) {
        console.error("Error: ", error);
        ItemDataContainer.innerHTML = "<p style='color:red'>Failed to get items</p>";
    }
}
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
const updateItem = (id) => {
    window.location.href = `/update.html?id=${id}`;
}

const deleteItem = async (id) => {
    try {
        console.log(`Attempting to delete item with id: ${id}`); // Log the item id
        const response = await fetch(`/ItemData/${id}`, {
            method: 'DELETE'
        });
        console.log("Response status:", response.status); // Log response status
        if (response.ok) {
            alert("Item successfully deleted");
            fetchItemData(); // Refresh the list
        } else {
            const errorText = await response.text(); // Get error text from response
            console.error("Failed to delete item:", errorText); // Log the error text
            throw new Error("Failed to delete item");
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("Failed to delete item");
    }
}

fetchItemData();