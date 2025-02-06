import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogContentText,
} from "@mui/material";
import Header from "../HEADER/Header";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "./UsersProfile.css";
import axios from "axios";
function UsersProfile() {
  const { userUId } = useParams();
  const [userData, setUserData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userUId) {
        console.log(userUId);
        try {
          const userResponse = await axios.get(
            `http://localhost:3000/getUser/${userUId}`
          );
          const user = userResponse.data.data;

          const flatsResponse = await axios.get(
            `http://localhost:3000/getFlatByOwnerId/${userUId}`
          );
          const flatsData = flatsResponse.data;

          setUserData({ ...user, flats: flatsData });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userUId]);

  const handleMakeAdmin = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/updateUser/${userData._id}`,
        {
          permission: "admin",
        }
      );
      console.log(response.data);
      setSnackbarMessage("User role updated to admin");
      setOpenSnackbar(true);
      handleClose();
    } catch (error) {
      console.error("Error updating user role:", error);
      setSnackbarMessage("Failed to update user role");
      setOpenSnackbar(true);
    }
  };

  if (!userData) {
    return <Typography variant="h6">Loading user data...</Typography>;
  }

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.7,
    },
    {
      field: "city",
      headerName: "City",
    },
    {
      field: "streetName",
      headerName: "Street Name",
      flex: 0.5,
    },
    {
      field: "streetNumber",
      headerName: "Street No.",
    },
    {
      field: "areaSize",
      headerName: "Area Size",
    },
    {
      field: "rentPrice",
      headerName: "Rent Price",
    },
    {
      field: "yearBuild",
      headerName: "Year Built",
    },
    {
      field: "dateAvailable",
      headerName: "Date Available",
      flex: 0.5,
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
      field: "hasAc",
      headerName: "Has AC",
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
  ];

  return (
    <div>
      <div className="background__container__usersProfile">
        <Header></Header>
        <KeyboardReturnIcon
          onClick={() => navigate("/all-users")}
          sx={{
            color: "white",
            margin: "10px 20px",
            cursor: "pointer",
          }}
        ></KeyboardReturnIcon>

        <div className="eachUserProfile__details">
          <Typography variant="h4">PROFILE OF {userData.fullName}</Typography>
          <div className="information__container">
            <div className="users__details">
              <div>
                <PersonOutlineIcon
                  sx={{ fontSize: "160px", color: "rgb(82, 22, 139)" }}
                ></PersonOutlineIcon>
              </div>
              <div className="hero__information">
                <Typography
                  className="specific__information"
                  variant="h6"
                  sx={{ fontFamily: "inherit", mt: "15px" }}
                >
                  UID: {userData._id}
                </Typography>
                <Typography
                  className="specific__information"
                  variant="h6"
                  sx={{ fontFamily: "inherit" }}
                >
                  Email: {userData.email}
                </Typography>
                <Typography
                  className="specific__information"
                  variant="h6"
                  sx={{ fontFamily: "inherit" }}
                >
                  Birth Date:{" "}
                  {new Date(userData.birthDate).toLocaleDateString()}
                </Typography>
                <Typography
                  className="specific__information"
                  variant="h6"
                  sx={{ fontFamily: "inherit" }}
                >
                  Role: {userData.permission}
                </Typography>
              </div>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  textAlign: "center",
                  height: "50px",
                  marginTop: "100px",
                }}
              >
                {userData.permission === "user" && (
                  <>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "green", fontFamily: "inherit" }}
                      onClick={handleMakeAdmin}
                    >
                      Make Admin
                    </Button>
                  </>
                )}
              </Box>
            </div>
          </div>
        </div>

        <div className="user_flats_container">
          <Typography variant="h5">USER FLATS:</Typography>
        </div>
        <div style={{ height: 500, width: "75%", margin: "auto" }}>
          <DataGrid
            className="custom__grid__class"
            rows={userData.flats}
            columns={columns}
            autoHeight
            autosizeOnMount
            pageSize={5}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            getRowId={(row) => row._id}
            pageSizeOptions={[5]}
          />
        </div>
        <Dialog
          open={isDialogOpen}
          keepMounted
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleSave,
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
            Are you sure you want to make this user admin?
            <div>
              <Button
                onClick={handleSave}
                sx={{ color: "green", fontSize: "16px" }}
              >
                Yes
              </Button>
              <Button
                onClick={handleClose}
                sx={{ color: "red", fontSize: "16px" }}
              >
                Cancel
              </Button>
            </div>
          </DialogContentText>
        </Dialog>

        {/* Snackbar for messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default UsersProfile;
