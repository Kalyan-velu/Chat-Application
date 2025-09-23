import React, { useState } from "react";
import { Grid, Paper, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingButton from "@mui/material/button";
import { authInstance } from "@/config/axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [open, setOpen] = React.useState(false);

  const [openS, setOpenS] = React.useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const gridStyle = {
    display: "grid",
    justifyContent: "center",
  };
  const paperStyle = {
    backgroundColor: "#d6dbee",
    borderRadius: "10px",
    padding: "0 15px 40px 15px",
    width: "inherit",
  };
  const styleField = {
    padding: "5px",
  };
  const btnStyle = {
    color: "#0072E5",
    display: "center",
    marginTop: 10,
    width: "50%",
  };

  const phoneRegExp = /^[1-9]{0}[0-9]{9}/;
  const passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenS(false);
    setOpen(false);
  };

  const initialValues = {
    phoneNumber: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(phoneRegExp, "Enter Valid Phone number")
      .required("Required"),
    password: Yup.string()
      .min(6, "Minimum characters should be 6")
      .matches(
        passwordRegExp,
        "Password must have  one upper,lower case,number,special character",
      )
      .required("Required"),
  });

  const onSubmit = async (values) => {
    const response = await authInstance.post("/login", values).catch((err) => {
      console.log(err);
      setError(err.response.data.message);
      setOpen(true);
    });
    if (response) {
      console.log(`Data in localstorage:${response.data}`);

      setSuccess(response.data.message);
      setOpenS(true);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setTimeout(function () {
        navigate("app/chats");
      }, 1000);
    }
  };

  return (
    <Grid style={gridStyle} id={"suspense"}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form noValidate>
            <Paper elevation={0} style={paperStyle}>
              <div style={styleField}>
                <Field
                  as={TextField}
                  padding={"dense"}
                  margin={"dense"}
                  name="phoneNumber"
                  label="Enter Phone Number"
                  fullWidth
                  error={props.errors.phoneNumber && props.touched.phoneNumber}
                  helperText={<ErrorMessage name="Phone Number" />}
                  required
                />
                <Field
                  as={TextField}
                  padding={"dense"}
                  margin={"dense"}
                  type={"password"}
                  name="password"
                  label="Enter Password"
                  fullWidth
                  error={props.errors.password && props.touched.password}
                  helperText={<ErrorMessage name="Password" />}
                  required
                />
              </div>

              <Grid align="center">
                <Snackbar
                  open={openS}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    {success}
                  </Alert>
                </Snackbar>
                {error ? (
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                  >
                    <Alert
                      onClose={handleClose}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      {error}
                    </Alert>
                  </Snackbar>
                ) : null}
              </Grid>
            </Paper>
            <Grid align="center">
              <Typography variant="caption" color={"secondary"}>
                Fill the form to login into your account
              </Typography>
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <LoadingButton type="submit" style={btnStyle} variant="outlined">
                login
              </LoadingButton>
            </div>
          </Form>
        )}
      </Formik>
    </Grid>
  );
};

export default Login;
