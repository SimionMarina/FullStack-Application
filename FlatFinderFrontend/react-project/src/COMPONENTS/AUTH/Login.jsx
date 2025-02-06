import { useState } from "react";
import "boxicons/css/boxicons.min.css";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GoogleIcon from "../../assets/GOOGLE-ICON.svg";
import { useNavigate, Link } from "react-router-dom";
import showToaster from "../../SERVICES/toaster-service";
import { ToastContainer } from "react-toastify";
import { validationRules } from "../../VALIDATIONS/validation";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    let validationResponse = true;

    // Validate Email
    validationResponse =
      validationRules["email"](formData.email) && validationResponse;

    // Validate Password
    validationResponse =
      validationRules["password"](formData.password) && validationResponse;

    if (!validationResponse) {
      showToaster("error", "Validation failed, correct the errors");
      return; // Stop execution if validation fails
    }

    if (!isSigningIn) {
      setIsSigningIn(true);
      const userCredentials = {
        email: formData.email,
        password: formData.password,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          userCredentials
        );

        if (response.data && response.data.token) {
          //Save the token in localStorage
          localStorage.setItem("token", response.data.token);
          showToaster("success", "Login successful!");

          setTimeout(() => {
            navigate("/firstView");
          }, 2000);
        } else {
          showToaster("error", "No token received. Login failed.");
        }
      } catch (error) {
        console.error("Login error:", error);
        showToaster("error", "Login failed.");
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="background__division">
        <div className="image__section">
          <div className="formSection__responsive">
            <div>
              <h1 className="form__title">Login</h1>
              <div className="inputs__side">
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Email
                  </InputLabel>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Password
                  </InputLabel>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="remember__forgot login__remember__forgot">
                <p className="checkbox__text">
                  <Checkbox className="checkbox" />
                  Remember me
                </p>
                <p className="forgot__password">
                  <Link to="/ForgotPassword" className="forgot__password">
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleClick}
                  className="login__button"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    width: "100%",
                    height: "50px",
                  }}
                >
                  Log In
                </Button>
              </Stack>

              <div className="separator">
                <div className="line"></div>
                <p className="text">or</p>
              </div>

              <div className="icon-container">
                <img src={GoogleIcon} className="icon" alt="Google Icon" />
                Sign In With Google
              </div>

              <div className="navigate login__noAccount">
                <p className="no__account">Don`t have an account?`</p>
                <Link to="/register" className="navigate__button">
                  Sign Up Here
                </Link>
              </div>
            </div>
          </div>

          <h2 className="hero__title">Turn Your Ideas into Reality</h2>
          <p className="hero__paragraph">
            Start for free and get attractive offers from the community
          </p>
        </div>

        <div className="form__section loginForm__section">
          <div className="form__details">
            <div className="logo__section login__logo">
              <i className="bx bxs-home-heart"></i>
              <h4 className="company__title">FlatFinder</h4>
            </div>

            <div className="form__header">
              <h1 className="form__title">Login</h1>
              <p className="form__info">
                Welcome back! Please enter your details.
              </p>
            </div>

            <div>
              <div className="inputs__side">
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Email
                  </InputLabel>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Password
                  </InputLabel>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div className="remember__forgot login__remember__forgot">
                <p className="checkbox__text">
                  <Checkbox className="checkbox" />
                  Remember me
                </p>
                <p className="forgot__password">
                  <Link to="/ForgotPassword" className="forgot__password">
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleClick}
                  className="login__button"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    width: "100%",
                    height: "50px",
                  }}
                >
                  Log In
                </Button>
              </Stack>

              <div className="separator">
                <div className="line"></div>
                <p className="text">or</p>
              </div>

              <div className="icon-container">
                <img src={GoogleIcon} className="icon" alt="Google Icon" />
                Sign In With Google
              </div>

              <div className="navigate login__noAccount">
                <p className="no__account">Don`t have an account?`</p>
                <Link to="/register" className="navigate__button">
                  Sign Up Here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
