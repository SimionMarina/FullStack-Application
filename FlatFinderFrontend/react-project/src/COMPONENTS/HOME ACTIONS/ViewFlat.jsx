import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";
import { Typography, TextField, Button, Container, Grid } from "@mui/material";
import "../HOME/Home.css";
import Header from "../HEADER/Header";
import EditFlat from "./EditFlat";
import "./ViewFlat.css";
import showToastr from "../../SERVICES/toaster-service";
import { ToastContainer } from "react-toastify";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ViewFlat() {
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFlatId, setEditFlatId] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlatAndOwner = async () => {
      try {
        // Fetch flat data
        const flatResponse = await axios.get(
          `http://localhost:3000/getFlatById/${flatId}`
        );
        const flatData = flatResponse.data.data;
        setFlat(flatData);
        
        // Fetch owner data
        const ownerResponse = await axios.get(
          `http://localhost:3000/getUser/${flatData.ownerID}`);
        const ownerData = ownerResponse.data.data;
        setOwner(ownerData);
      } catch (error) {
        console.error("Error fetching flat or owner:", error);
      }
    };

    fetchFlatAndOwner();
  }, [flatId]);

  const handleEdit = () => {
    setEditFlatId(flatId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFlatId(null);
  };

  const handleUpdateFlat = (updatedFlat) => {
    setFlat(updatedFlat); // Update flat details locally
    handleCloseEditModal();
  };

  const handleSendMessage = async () => {
    if (!currentUser || !flat) {
      console.error("User not signed in or flat data not loaded");
      return;
    }

    const newMessage = {
      content: message,
      senderUid: currentUser._id,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      createdAt: new Date(),
      flatId: flatId,
    };

    if (message !== "") {
      try{
        const updatedMessages = [...(owner.messages || []), newMessage];
        const response = await axios.patch(
            `http://localhost:3000/updateUser/${owner._id}`,
            {
              messages: updatedMessages,
            }
          );
          console.log(response.data)
          if (response.status === 200) {
            setMessage("");
            showToastr("success", "Message sent successfully!");
          } else {
            showToastr("error", "Failed to send message.");
            console.error("Unexpected response:", response);
          }
      }catch (error) {
        console.error("Error sending message:", error);
        showToastr("error", "Error sending message. Please try again.");
      }
    } else {
      showToastr("error", "Can't send a message without content!");
    }
  };

  if (!flat || !owner) return <Typography>Loading flat details...</Typography>;

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="background__container__home">
        <Header />
        <KeyboardReturnIcon
          onClick={() => navigate("/")}
          sx={{
            color: "gray",
            margin: "10px 20px",
            cursor: "pointer",
          }}
        ></KeyboardReturnIcon>
        <div className="main__container">
          <div className="backdrop__container">
            <Container
              sx={{
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  marginBottom: 0,
                  color: "rgb(82, 22, 139)",
                  fontFamily: "inherit",
                  fontSize: "22px",
                }}
              >
                Flat Owner: {owner.fullName} {/*Display the owner's name*/}
              </Typography>
            </Container>
            <div className="flat__details__container">
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: "inherit" }}
              >
                Flat Details:
              </Typography>
              <Grid container width={"60%"} sx={{ marginLeft: "100px" }}>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px", mr: "10px" }}
                  >
                    Address:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    {flat.city}, {flat.streetName} {flat.streetNumber}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    Area Size:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    {flat.areaSize}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    Has AC:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    {flat.hasAc ? "Yes" : "No"}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    Year Built:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    {flat.yearBuild}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    Rent Price:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    ${flat.rentPrice}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    Date Available:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "inherit", fontSize: "18px" }}
                  >
                    {flat.dateAvailable}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <Container sx={{ padding: 0 }}>
              {flat.ownerID !== currentUser._id ? (
                <Container
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: 0,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "rgb(82, 22, 139)",
                      paddingTop: "10px",
                      fontFamily: "inherit",
                      fontSize: "22px",
                    }}
                  >
                    Send a message to the owner
                  </Typography>
                  <TextField
                    className="send__message__textfield"
                    label="Your Message"
                    fullWidth
                    multiline
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      marginBottom: "16px",
                      border: "2px solid black",
                      borderRadius: "7px",
                    }}
                  />
                  <Button
                    className="sendMessage__button"
                    variant="contained"
                    onClick={handleSendMessage}
                    fullWidth
                    style={{
                      height: "45px",
                      backgroundColor: "blueviolet",
                      border: "2px solid black",
                      color: "black",
                      fontFamily: "inherit",
                    }}
                  >
                    Send Message
                  </Button>
                </Container>
              ) : (
                <Container
                  sx={{
                    width: "40%",
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    color: "white",
                    padding: 0,
                  }}
                >
                  <Button
                    className="editFlat__button"
                    variant="contained"
                    onClick={handleEdit}
                    fullWidth
                    style={{
                      height: "45px",
                      width: "450px",
                      backgroundColor: "blueviolet",
                      border: "2px solid black",
                      color: "black",
                      fontFamily: "inherit",
                      fontSize: "16px",
                    }}
                  >
                    Edit Flat
                  </Button>
                </Container>
              )}
            </Container>
          </div>
        </div>
        {/* Modal for Editing Flat */}
        <EditFlat
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          flatId={editFlatId}
          onUpdate={handleUpdateFlat}
        />
      </div>
    </>
  );
}

export default ViewFlat;
