import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import { Shield, Ban, CheckCircle, Trash2, User } from 'lucide-react';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = !currentStatus;

            await axios.put(`${API_URL}/api/users/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Optimistic update
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            toast.success(`User ${newStatus ? 'Unblocked' : 'Blocked'} successfully`);
        } catch (err) {
            console.error(err);
            toast.error('Error updating status');
        }
    };

    const handleRoleChange = async (id, newRoleId) => {
        try {
            const token = localStorage.getItem('token');
            const roleIdInt = parseInt(newRoleId);

            await axios.put(`${API_URL}/api/users/${id}/role`,
                { roleId: roleIdInt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(u => u.id === id ? { ...u, roleId: roleIdInt } : u));
            toast.success('Role updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Error updating role');
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading Admin Panel...</p>
        </div>
    );

    return (
        <div className="container fade-in">
            <div className="page-header">
                <Shield size={32} strokeWidth={2.5} />
                <h1>Users Management</h1>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>#{u.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <User size={16} color="#666" />
                                            </div>
                                            <strong>{u.username}</strong>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.roleId}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            style={{ padding: '6px', fontSize: '0.85rem', width: 'auto' }}
                                        >
                                            <option value={1}>Admin</option>
                                            <option value={2}>User</option>
                                        </select>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.status ? 'badge-active' : 'badge-blocked'}`}>
                                            {u.status ? <CheckCircle size={12} style={{ marginRight: '4px' }} /> : <Ban size={12} style={{ marginRight: '4px' }} />}
                                            {u.status ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleStatusToggle(u.id, u.status)}
                                            className={`btn btn-sm ${u.status ? 'btn-outline' : 'btn-primary'}`}
                                            title={u.status ? 'Block User' : 'Unblock User'}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            {u.status ? <Ban size={16} /> : <CheckCircle size={16} />}
                                            {u.status ? 'Block' : 'Unblock'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: '#888', marginBottom: '40px', fontSize: '0.9rem' }}>
                <p>Showing {users.length} registered users</p>
            </div>
        </div>
    );
};

export default AdminPanel;
