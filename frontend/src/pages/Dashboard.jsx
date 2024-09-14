import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/users";
import { useNavigate } from "react-router-dom"; // For redirecting

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);  // Store the logged-in user's ID
    const navigate = useNavigate(); // Initialize navigate for redirection

    useEffect(() => {
        // Fetch balance and user info from the backend
        const fetchUserData = async () => {
            const token = localStorage.getItem("token"); // Get token from local storage

            if (!token) {
                setError("No token found. Please login."); // Handle missing token case
                navigate("/signin"); // Redirect to signin if token is missing
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in headers
                    },
                });

                setBalance(response.data.balance); // Set the balance state
                setUserId(response.data.userId);  // Get and store the user ID
            } catch (err) {
                setError("Failed to fetch balance");
            } finally {
                setLoading(false); // Ensure loading state is stopped
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <Balance value={balance} />
                )}
                <Users loggedInUserId={userId} /> {/* Pass logged-in userId to Users */}
            </div>
        </div>
    );
};
