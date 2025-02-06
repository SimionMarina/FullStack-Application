import { useState, useEffect } from "react";
import { useAuth } from "../../CONTEXT/authContext";
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Container,
} from "@mui/material";
import Header from "../HEADER/Header";
import "./Inbox.css";
import { ToastContainer } from "react-toastify";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inbox = () => {
  const [groupedMessages, setGroupedMessages] = useState({});
  const [flatDetails, setFlatDetails] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/inbox/${currentUser._id}`
          );
          const { messages, flatDetails } = data;
          console.log(messages);
          // Group messages by senderUid
          const grouped = messages.reduce((acc, message) => {
            const senderUid = message.senderUid;
            if (!acc[senderUid]) {
              acc[senderUid] = [];
            }
            acc[senderUid].push(message);
            return acc;
          }, {});

          setGroupedMessages(grouped);
          setFlatDetails(flatDetails);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [currentUser]);

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="background__container__inbox">
        <Header />
        <KeyboardReturnIcon
          onClick={() => navigate("/")}
          sx={{
            color: "gray",
            margin: "10px 20px",
            cursor: "pointer",
          }}
        ></KeyboardReturnIcon>

        <Container>
          <Typography
            sx={{ display: "flex", justifyContent: "center" }}
            gutterBottom
          >
            <h2 className="inbox__title">MESSAGES</h2>
          </Typography>
          <Stack className="stack__container" spacing={2}>
            {Object.keys(groupedMessages).length === 0 ? (
              <Typography
                sx={{
                  color: "red",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  padding: "10px 20px",
                }}
              >
                No messages found.
              </Typography>
            ) : (
              Object.keys(groupedMessages).map((senderUid) => (
                <Card
                  sx={{ background: "rgba(0,0,0,0.4)" }}
                  className="card__container"
                  key={senderUid}
                >
                  <CardContent className="card__content">
                    <Typography variant="h6">
                      From: {groupedMessages[senderUid][0].senderName}
                    </Typography>
                    {groupedMessages[senderUid].map((message, index) => {
                      const flat = flatDetails[message.flatId];
                      return (
                        <div key={index} style={{ marginBottom: "10px" }}>
                          <Typography variant="body1">
                            {message.content}
                          </Typography>
                          {flat && (
                            <Typography variant="caption" color="textSecondary">
                              Flat Location: {flat.city}, {flat.streetName}{" "}
                              {flat.streetNumber}
                            </Typography>
                          )}
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            Sent on:{" "}
                            {new Date(message.createdAt).toLocaleString()}
                          </Typography>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Container>
      </div>
    </>
  );
};

export default Inbox;
