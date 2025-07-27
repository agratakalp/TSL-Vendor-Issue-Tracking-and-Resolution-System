import apiClient from "./apiClient";

export interface User {
  id: number;
  username: string;
  role: string;
  created_at?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const createUser = async (data: { 
  username: string; 
  password: string; 
  role?: string; 
}): Promise<any> => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: { 
  username: string; 
  role: string; 
}): Promise<any> => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
}; 