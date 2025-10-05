import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MuiAlert from "@mui/material/Alert";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authInstance } from "@/config/axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event) => {
    if (reason === "clickaway") return;
    setOpenError(false);
    setOpenSuccess(false);
  };

  const initialValues = {
    phoneNumber: "9999999999",
    password: "5~c~8x)#UbsAk]#",
  };
  const phoneRegExp = /^[1-9]{0}[0-9]{9}$/;
  const passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      // .matches(phoneRegExp, "Enter a valid phone number")
      .required("Required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .matches(
        passwordRegExp,
        "Password must have upper, lower, number & special char",
      )
      .required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await authInstance.post("/login", values);
      setSuccessMsg(response.data.message);
      setOpenSuccess(true);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      navigate("/app/chats");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
      setOpenError(true);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2} color="white">
        Login to your account
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
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                size="small"
                error={props.errors.phoneNumber && props.touched.phoneNumber}
                helperText={<ErrorMessage name="phoneNumber" />}
              />
            </Box>
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                size="small"
                error={props.errors.password && props.touched.password}
                helperText={<ErrorMessage name="password" />}
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
              {loading ? "Wait a moment..." : "Login"}
            </Button>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar open={openError} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
