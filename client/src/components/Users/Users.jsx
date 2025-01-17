import React, { useState, useEffect } from 'react';
import {deleteUser, getAllUsers, updateRole} from "../../services/apiUsers.jsx";
import { Button } from 'react-bootstrap';
import './Users.css';


const Users = () => {
    const [Users,setUsers] = useState([]);
    const [editRowId, setEditRowId] = useState(null); // Keeps track of the row in edit mode
    const [editedRole, setEditedRole] = useState(''); // Stores the new role for the edited row

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const email = localStorage.getItem('email'); // Get the current user's email
                const users = await getAllUsers();
                // Filter out the current user by email
                const filteredUsers = users.filter(user => user.email !== email);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchUsers();
    }, [Users]);

    const handleEditClick =(user) => {

        setEditRowId(user.id); // Set the current row in edit mode
        setEditedRole(user.role); // Initialize the dropdown with the user's current role
    };

    const handleSaveClick = async (user) => {
        if(user.role !== editedRole) {
            try {
                await updateRole(user.id, editedRole);
                alert("Role updated successfully!");
                const updatedUsers = Users.map((u) =>
                    u.id === user.id ? {...u, role: editedRole} : u
                );
                setUsers(updatedUsers);
            } catch (err) {
                alert("Failed to update role: " + (err.message || err));
            }
        }

        setEditRowId(null); // Exit edit mode
    };

    const handleCancelClick = () => {
        setEditRowId(null); // Exit edit mode without saving changes
    };
    const handleDeleteClick = async (user) =>{
        try {
            await deleteUser(user.id);
            alert("User deleted successfully!");
            setUsers((prev) => prev.filter((u) => user.id !== u.id));
        } catch (err) {
            alert("Failed to delete user: " + (err.message || err));
        }
    }

    return (
        <div className="table-responsive" style={{marginTop: 20}}>
            <table className="custom-table">
                <thead className="table-dark">
                <tr>
                    <th scope="col" className="text-end">ID</th>
                    <th scope="col" className="text-end">Name</th>
                    <th scope="col" className="text-end">Email</th>
                    <th scope="col" className="text-end">Role</th>
                    <th scope="col" className="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {Users.map((user) => (
                    <tr key={user.id} className="table-row-custom">

                        <td className="text-end">{user.id}</td>
                        <td className="text-end">{user.name}</td>
                        <td className="text-end">{user.email}</td>
                        <td className="text-end">
                            {editRowId === user.id ? (
                                <select
                                    value={editedRole}
                                    onChange={(e) => setEditedRole(e.target.value)}
                                    className="form-select2"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            ) : (
                                user.role
                            )}
                        </td>
                        <td className="text-end">
                            {editRowId === user.id ? (
                                <>
                                    <button
                                        className="button button-save"
                                        onClick={() => handleSaveClick(user)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="button button-delete"
                                        onClick={handleCancelClick}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>

                                        <button
                                            className="button button-edit"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="button button-delete"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            Delete
                                        </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;




