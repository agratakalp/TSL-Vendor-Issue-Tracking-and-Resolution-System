import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/procurement-issue-management/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setFormData({ username: '', password: '', role: 'user' });
      setShowCreateForm(false);
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      alert('Failed to create user.');
      console.error(error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, { username: formData.username, role: formData.role });
      setFormData({ username: '', password: '', role: 'user' });
      setEditingUser(null);
      fetchUsers();
      alert('User updated successfully!');
    } catch (error) {
      alert('Failed to update user.');
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        alert('Failed to delete user.');
        console.error(error);
      }
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: '', role: user.role });
  };

  return (
    <div className="container p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button className="btn btn-blue px-4 py-2" onClick={() => navigate('/login')}>Home</button>
        <button className="btn btn-green px-4 py-2" onClick={() => setShowCreateForm(true)}>Add User</button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {loading ? (
          <div className="text-center p-8">Loading users...</div>
        ) : (
          <table className="table">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button className="btn btn-blue px-2 py-1" onClick={() => startEdit(user)}>
                      Edit
                    </button>
                    <span style={{ display: 'inline-block', width: 8 }}></span>
                    <button className="btn" style={{ background: '#dc2626', color: '#fff', padding: '.25rem .5rem' }} onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="bg-white p-6 rounded-lg" style={{ width: 384 }}>
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  className="input"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  className="select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="logger">Logger</option>
                  <option value="resolver">Resolver</option>
                  <option value="logger&resolver">Logger & Resolver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-green px-4 py-2">
                  Create
                </button>
                <button type="button" className="btn btn-gray px-4 py-2" onClick={() => setShowCreateForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="bg-white p-6 rounded-lg" style={{ width: 384 }}>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  className="input"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  className="select"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="logger">Logger</option>
                  <option value="resolver">Resolver</option>
                  <option value="logger&resolver">Logger & Resolver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-blue px-4 py-2">
                  Update
                </button>
                <button type="button" className="btn btn-gray px-4 py-2" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;