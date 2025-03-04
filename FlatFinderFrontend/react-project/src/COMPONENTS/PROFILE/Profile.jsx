import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useAuth } from "../../CONTEXT/authContext";
import Header from "../HEADER/Header";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import showToaster from "../../SERVICES/toaster-service";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "./Profile.css";
import axios from "axios";

function Profile() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    birthDate: currentUser.birthDate,
  });

  const handleUpdateMyProfile = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/updateUser/${currentUser._id}`,
        formData
      );

      if (response.status === 200) {
        console.log("User updated successfully:", response.data.user);

        // Close the modal or form (assuming `handleClose` does this)
        handleClose();

        // Optionally reload or update the user data on the frontend
        window.location.reload();
      }
    } catch (error) {
      console.error(
        `Error updating user: ${error.response?.data?.error || error.message}`
      );
    }
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleCloseDeleteAccount = () => {
    setIsModalOpen(false);
  };

  const handleDeletePermission = async () => {
    try {
      await axios.delete(`http://localhost:3000/deleteUser/${currentUser._id}`);

      console.log("User deleted successfully");

      setIsModalOpen(false);

      showToaster("success", "Account successfully deleted");

      setTimeout(() => {
        navigate("/register");
      }, 2000);
      
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="background__container__home">
        <Header></Header>
        <KeyboardReturnIcon
          onClick={() => navigate("/")}
          sx={{
            color: "gray",
            margin: "10px 20px",
            cursor: "pointer",
          }}
        ></KeyboardReturnIcon>
        <Container className="profile__hero__container">
          <h2 style={{ textAlign: "center" }}>Account data</h2>
          <Container
            sx={{
              display: "flex",
              color: "black",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PermIdentityIcon
              sx={{
                fontSize: "200px",
                color: "blueviolet",
              }}
            />
            <Container>
              <Typography sx={{ fontSize: "18px" }}>
                Name: {currentUser.fullName}
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Email: {currentUser.email}
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Birth date:{" "}
                {new Date(currentUser.birthDate).toLocaleDateString()}
              </Typography>
              <Button
                className="update__profile__button"
                variant="contained"
                onClick={handleUpdateMyProfile}
              >
                Update data
              </Button>
              <Button className="delete__accout__button" onClick={handleDelete}>
                Delete Account
              </Button>
            </Container>
          </Container>
        </Container>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Profile</DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              type="email"
            />
            <TextField
              margin="dense"
              label="Birth Date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              fullWidth
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog
        open={isModalOpen}
        keepMounted
        onClose={handleCloseDeleteAccount}
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
          Are you sure you want to delete your account?
          <div>
            <Button
              onClick={handleDeletePermission}
              sx={{ color: "green", fontSize: "16px" }}
            >
              Yes
            </Button>
            <Button
              onClick={handleCloseDeleteAccount}
              sx={{ color: "red", fontSize: "16px" }}
            >
              Cancel
            </Button>
          </div>
        </DialogContentText>
      </Dialog>
    </>
  );
}

export default Profile;
