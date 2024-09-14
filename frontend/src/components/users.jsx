import { useEffect, useState, useRef } from "react";
import { Button } from "./button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = ({ loggedInUserId }) => {
    const [users, setUsers] = useState([]);  // Ensure users is always an array
    const [filter, setFilter] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const debounceRef = useRef(null);  // Ref for debounce timeout

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage
                if (!token) {
                    setError("No token found. Please login.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`https://my-project-2-backend.onrender.com/api/v1/user/bulk?filter=${filter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in headers
                    },
                });

                // Filter out the current user based on userId
                const filteredUsers = response.data.users.filter(user => user._id !== loggedInUserId);

                setUsers(filteredUsers || []); // Ensure users is an array
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch users");
                setLoading(false);
            }
        };

        if (debounceRef.current) {
            clearTimeout(debounceRef.current); // Clear the previous timeout
        }

        debounceRef.current = setTimeout(() => {
            fetchUsers(); // Fetch users after a delay
        }, 300); // Adjust debounce delay as needed (300ms in this example)

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current); // Cleanup timeout on component unmount
            }
        };
    }, [filter, loggedInUserId]);

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <div className="font-bold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    users.map((user) => <User key={user._id} user={user} />)
                )}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.name[0]} {/* Display the first letter of the user's name */}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.name} {/* Display the user's full name */}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button
                    onClick={() => {
                        navigate("/send?id=" + user._id + "&name=" + user.name);
                    }}
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}
