import { useEffect, useState } from "react";
import { useAuth } from "../../CONTEXT/authContext";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Dialog, DialogContentText, Button } from "@mui/material";

import {
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Visibility,
} from "@mui/icons-material";
import axios from "axios";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { useNavigate } from "react-router-dom";
import EditFlat from "../HOME ACTIONS/EditFlat";
import "./Home.css";
import "./FlatsTable.css";

function FlatsTable({ tableType, refetchFlag }) {
  const [flats, setFlats] = useState([]);
  const { currentUser } = useAuth();
  const [role, setRole] = useState("user");
  const [favorites, setFavorites] = useState(currentUser.favoriteFlatList);
  const [editFlatId, setEditFlatId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const fetchFlats = async () => {
    let response;
    if (tableType === "all") {
      response = await axios.get("http://localhost:3000/flats");
      if (response) {
        let dataArray = response.data.data;

        for (let ele of dataArray) {
          ele.hasAC = ele.hasAC ? "Yes" : "No";
        }
        setFlats(dataArray);
      }
    } else if (tableType === "myFlats" && currentUser) {
      try {
        const response = await axios.get(
          `http://localhost:3000/getFlatByOwnerId/${currentUser._id}`
        );

        const foundFlats = response.data;
        setFlats(foundFlats);
      } catch (error) {
        console.error("Error fetching flats by owner:", error);
      }
    } else if (tableType === "favorites" && currentUser) {
      try {
        if (favorites && favorites.length > 0) {
          const response = await axios.post(
            "http://localhost:3000/favoriteFlats",
            {
              flatIds: favorites,
            }
          );

          const foundFlats = response.data;
          setFlats(foundFlats);
        } else {
          setFlats([]);
        }
      } catch (error) {
        console.error("Error fetching favorite flats:", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.permission || "user");
    }
    fetchFlats();
  }, [tableType, currentUser, role, refetchFlag]);

  const handleEdit = (id) => {
    setEditFlatId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    fetchFlats();
    setIsEditModalOpen(false);
    setEditFlatId(null);
  };

  const handleUpdateFlat = (updatedFlat) => {
    setFlats((prevFlats) =>
      prevFlats.map((flat) =>
        flat._id === updatedFlat._id ? updatedFlat : flat
      )
    );
  };

  const handleDeleteFlat = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deteleflat/${id}`
      );
      console.log(flats);
      setFlats(flats.filter((flat) => flat._id !== id));
      handleCloseDeleteModal();
      console.log("Flat deleted:", response.data);
    } catch (error) {
      console.error("Error deleting flat: ", error);
    }
  };

  const handleDelete = (id) => {
    setEditFlatId(id);
    setDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleToggleFavorite = async (id) => {
    try {
      let updatedFavorites = [...favorites];
      if (!favorites.includes(id)) {
        updatedFavorites.push(id);
      } else {
        updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
      }
      // Update user favorites in your backend
      const response = await axios.patch(
        `http://localhost:3000/updateUser/${currentUser._id}`,
        {
          favoriteFlatList: updatedFavorites,
        }
      );
      // Update local state after successful backend update
      setFavorites(updatedFavorites);

      if (tableType === "favorites") {
        setFlats(flats.filter((flat) => flat.id !== id));
      }

      console.log("User favorites updated:", response.data);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      // Clone the current favorites array and filter out the flat to delete
      const updatedFavorites = favorites.filter((favId) => favId !== id);
      // Update user favorites in your backend
      const response = await axios.patch(
        `http://localhost:3000/updateUser/${currentUser._id}`,
        {
          favoriteFlatList: updatedFavorites,
        }
      );

      // Update local state after successful backend update
      setFavorites(updatedFavorites);

      if (tableType === "favorites") {
        setFlats(flats.filter((flat) => flat._id !== id));
      }

      console.log("Favorite deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting favorite: ", error);
    }
  };

  const columns = [
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "streetName",
      headerName: "St. Name",
      flex: 1,
    },
    {
      field: "streetNumber",
      headerName: "St. No.",
      flex: 1,
    },
    {
      field: "areaSize",
      headerName: "Area Size",
      flex: 1,
    },
    {
      field: "hasAC",
      headerName: "Has AC",
      flex: 1,
    },
    {
      field: "yearBuild",
      headerName: "Year Built",
      flex: 1,
    },
    {
      field: "rentPrice",
      headerName: "Rent Price",
      flex: 1,
    },
    {
      field: "dateAvailable",
      headerName: "Date Available",
      flex: 1,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null;
        return date
          ? date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A";
      },
    },
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/flats/${params.row._id}`)}>
          <Visibility style={{ color: "green" }} />
        </IconButton>
      ),
      flex: 1,
    },
  ];

  if (tableType === "all") {
    columns.push({
      field: "favorite",
      headerName: "Favorite",
      renderCell: (params) => {
        const isOwner = params.row.ownerID === currentUser._id;
        if (!isOwner) {
          return (
            <IconButton
              onClick={() => {
                handleToggleFavorite(params.row._id);
              }}
            >
              {favorites.includes(params.row._id) ? (
                <Favorite style={{ color: "red" }} />
              ) : (
                <FavoriteBorder style={{ color: "red" }} />
              )}
            </IconButton>
          );
        }
        return null;
      },
      flex: 1,
    });
  }

  if (tableType === "myFlats") {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        renderCell: (params) => (
          <IconButton onClick={() => handleEdit(params.row._id)}>
            <Edit style={{ color: "blue" }} />
          </IconButton>
        ),
        flex: 1,
      },
      {
        field: "delete",
        headerName: "Delete",
        renderCell: (params) => (
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <Delete style={{ color: "red" }} />
          </IconButton>
        ),
        flex: 1,
      }
    );
  }

  if (tableType === "favorites") {
    columns.push({
      field: "favorite",
      headerName: "Delete Favorite",
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteFavorite(params.row._id)}>
          <HeartBrokenIcon style={{ color: "red" }} />
        </IconButton>
      ),
      flex: 1,
    });
  }

  return (
    <div style={{ height: 500, width: "80%", margin: "auto" }}>
      <DataGrid
        className="custom__class"
        sx={{
          ".MuiDataGrid-menuIcon": {
            visibility: "visible",
            width: "auto",
          },
        }}
        autoHeight
        autosizeOnMount
        rows={flats}
        columns={columns}
        pageSize={5}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        getRowId={(row) => row._id} //The data grid component requires all rows to have a unique `id` property.
        pageSizeOptions={[5]}
      />

      {/* Modal for Editing Flat */}
      {editFlatId && (
        <EditFlat
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          flatId={editFlatId}
          onUpdate={handleUpdateFlat}
        />
      )}

      <Dialog
        open={deleteModal}
        keepMounted
        onClose={handleCloseDeleteModal}
        PaperProps={{
          component: "form",
          onSubmit: handleDeleteFlat,
          sx: { backgroundColor: "#f2eee9", borderRadius: "30px" }, // modal background
        }}
        sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <DialogContentText
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            margin: "5px",
            color: "#8a2be2",
            fontFamily: "inherit",
            fontSize: "20px",
          }}
        >
          Are you sure you want to delete this flat?
          <div>
            <Button
              onClick={() => handleDeleteFlat(editFlatId)}
              sx={{ color: "green", fontSize: "16px" }}
            >
              Yes
            </Button>
            <Button
              onClick={handleCloseDeleteModal}
              sx={{ color: "red", fontSize: "16px" }}
            >
              Cancel
            </Button>
          </div>
        </DialogContentText>
      </Dialog>
    </div>
  );
}

export default FlatsTable;
