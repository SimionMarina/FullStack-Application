import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import showToaster from "../../SERVICES/toaster-service";
import { useAuth } from "../../CONTEXT/authContext";
import axios from "axios";
import "../HOME/Home.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewFlat({ setRefetchFlag }) {
  const [open, setOpen] = React.useState(false);
  const [hasAc, setHasAc] = React.useState(false);
  const { currentUser } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setHasAc(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Convert specific fields to their proper types
    const parsedData = {
      city: formJson.city,
      streetName: formJson.streetName,
      streetNumber: formJson.streetNumber,
      areaSize: Number(formJson.areaSize),
      hasAC: formJson.hasAc === "true" || formJson.hasAc === "on",
      yearBuild: Number(formJson.yearBuild),
      rentPrice: Number(formJson.rentPrice),
      dateAvailable: dayjs(formJson.dateAvailable).toISOString(),
    };

    //Add user id
    if (currentUser) {
      const flatData = {
        ...parsedData,
        ownerID: currentUser._id,
      };

      try {
        // Make an HTTP POST request to backend
        const response = await axios.post(
          "http://localhost:3000/createFlat",
          flatData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token if required
              body: JSON.stringify(parsedData),
            },
          }
        );

        if (response.status === 201) {
          // Display success message
          showToaster(
            "success",
            "Your flat has been successfully added! You are being redirected."
          );
          setRefetchFlag(true);
          handleClose();
        } else {
          showToaster("error", "Error adding flat. Please try again.");
        }
      } catch (error) {
        showToaster(
          "error",
          `Error adding flat: ${error.response?.data?.message || error.message}`
        );
      }
    } else {
      showToaster("error", "No current user is signed in.");
    }
  };

  return (
    <React.Fragment>
      <ToastContainer></ToastContainer>
      <div className="add_flat_box">
        <Button
          variant="outlined"
          className="add_flat_button"
          onClick={handleClickOpen}
        >
          +
        </Button>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          sx: { backgroundColor: "#f2eee9", borderRadius: "30px" }, // modal background
        }}
        sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <DialogContent>
          <DialogContentText
            sx={{
              margin: "5px",
              color: "blue",
              fontFamily: "inherit",
              fontSize: "20px",
            }}
          >
            To add a new flat, please complete all fields.
          </DialogContentText>
          <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="city"
              label="City"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="streetName"
              label="Street Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="streetNumber"
              label="Street Number"
              type="string"
              fullWidth
              variant="outlined"
            />
          </Stack>

          <TextField
            required
            margin="dense"
            name="areaSize"
            label="Area Size"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />

          {/* Checkbox for Has AC */}
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAc}
                onChange={handleCheckboxChange}
                name="hasAc"
                color="primary"
              />
            }
            label="Has AC"
            sx={{ marginTop: 2 }}
          />

          <TextField
            required
            margin="dense"
            name="yearBuild"
            label="Year Built"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            required
            margin="dense"
            name="rentPrice"
            label="Rent Price"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            required
            margin="dense"
            name="dateAvailable"
            label="Date Available"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button type="submit" sx={{ color: "green" }}>
            Add Flat
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
