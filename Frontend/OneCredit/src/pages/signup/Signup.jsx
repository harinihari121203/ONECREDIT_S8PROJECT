import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Signup() {
    console.log("API URL:", import.meta.env.VITE_API_URL); // Debugging step

    const googleAuth = () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            console.error("VITE_API_URL is not defined");
            return;
        }
        window.open(`${apiUrl}/auth/google/callback`, "_self");
    };
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Sign up Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./src/assets/signup.jpg" alt="signup" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Create Account</h2>
					<input type="text" className={styles.input} placeholder="Username" />
					<input type="text" className={styles.input} placeholder="Email" />
					<input
						type="password"
						className={styles.input}
						placeholder="Password"
					/>
					<button className={styles.btn}>Sign Up</button>
					<p className={styles.text}>or</p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./src/assets/google.png" alt="google icon" />
						<span>Sign up with Google</span>
					</button>
					<p className={styles.text}>
						Already Have Account ? <Link to="/login">Log In</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;