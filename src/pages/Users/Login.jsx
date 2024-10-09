import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import styles from '../../css/User.module.css'

const Login = () => {
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, loading, error, message, login, clearError } = useAuthContext();
  const isAuth = user;

  useEffect(() => {
    // If user is authenticated redirect him to home page
    if (isAuth) {
      navigate("/");
    }

    // If some error occurs display the error
    if (error) {
      toast.error(message);
      clearError();
    }
  }, [error, user]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    await login(emailVal, passwordVal);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          ref={emailRef}
          className={styles.loginInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          className={styles.loginInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default Login;
