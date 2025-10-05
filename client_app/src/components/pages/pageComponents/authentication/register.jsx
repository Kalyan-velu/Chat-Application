import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MuiAlert from "@mui/material/Alert";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify-icon/react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const phoneRegExp = /^[1-9]{2}[0-9]{8}/;
  const passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const initialValues = {
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Please enter an user name"),
    phoneNumber: Yup.string()
      // .matches(phoneRegExp, "Enter valid phone number")
      .required("Required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .matches(
        passwordRegExp,
        "Password must have upper, lower, number & special char",
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleClose = (event) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setOpenS(false);
  };
  const handleClickShowPassword = (name) => {
    if (name === "password") {
      setShowPassword((show) => !show);
    }
    if (name === "confirmPassword") {
      setShowConfirmPassword((show) => !show);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/user/register", values);
      setSuccess(response.data.message);
      setLoading(false);
      setOpenS(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2} color="white">
        Create your account
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="username"
                label="Username"
                variant="outlined"
                size="small"
                error={props.errors.username && props.touched.username}
                helperText={<ErrorMessage name="username" />}
              />
            </Box>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                size="small"
                error={props.errors.phoneNumber && props.touched.phoneNumber}
                helperText={<ErrorMessage name="phoneNumber" />}
              />
            </Box>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {" "}
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={() => handleClickShowPassword("password")}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {!showPassword ? (
                            <Icon icon="material-symbols:visibility-outline" />
                          ) : (
                            <Icon icon="material-symbols:visibility-off-outline-rounded" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                size="small"
                error={props.errors.password && props.touched.password}
                helperText={<ErrorMessage name="password" />}
              />
            </Box>
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {" "}
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={() =>
                            handleClickShowPassword("confirmPassword")
                          }
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {!showConfirmPassword ? (
                            <Icon icon="material-symbols:visibility-outline" />
                          ) : (
                            <Icon icon="material-symbols:visibility-off-outline-rounded" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                error={
                  props.errors.confirmPassword && props.touched.confirmPassword
                }
                helperText={<ErrorMessage name="confirmPassword" />}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              sx={{
                background: "linear-gradient(90deg,#0072E5,#3399FF)",
                color: "#fff",
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(90deg,#3399FF,#0072E5)",
                },
              }}
            >
              {loading ? "Creating a new account..." : "Create an account"}
            </Button>
          </Form>
        )}
      </Formik>

      <Snackbar open={openS} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
