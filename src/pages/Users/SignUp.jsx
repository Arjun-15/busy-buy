import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import styles from '../../css/User.module.css'

const SignUp = () => {
    // Input refs
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    const { user, loading, error, message, signup, clearError } = useAuthContext();

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
    }, [error, user, message]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const nameVal = nameRef.current.value;
        const emailVal = emailRef.current.value;
        const passwordVal = passwordRef.current.value;

        // Form validation
        if (
            emailVal === "" ||
            nameVal === "" ||
            passwordVal === "" ||
            passwordVal.length < 6
        ) {
            return toast.error("Please enter valid data!");
        }
        debugger;
        // call the signup function
        await signup({ name: nameVal, email: emailVal, password: passwordVal });
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={onSubmitHandler}>
                <h2 className={styles.loginTitle}>Sign Up</h2>
                <input
                    type="text"
                    name="name"
                    ref={nameRef}
                    placeholder="Enter Name"
                    className={styles.loginInput}
                />
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
                    {loading ? "..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
