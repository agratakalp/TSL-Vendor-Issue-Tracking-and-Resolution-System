import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, updateUser, deleteUser, User } from '../../../services/procurement-issue-management/userService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
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

  const handleCreateUser = async (e: React.FormEvent) => {
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

  const handleUpdateUser = async (e: React.FormEvent) => {
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

  const handleDeleteUser = async (id: number) => {
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

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: '', role: user.role });
  };

  return (
    <div className="container mx-auto p-4 flex flex-col">
      <button
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/login')}
      >
        Home
      </button>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setShowCreateForm(true)}
          >
            Add User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => startEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteUser(user.id)}
                    >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
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
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Create
                </button>
                <button 
                  type="button" 
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  className="w-full border rounded px-3 py-2"
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
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Update
                </button>
                <button 
                  type="button" 
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditingUser(null)}
                >
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
