import apiClient from "./apiClient";

export const getListViews = async () =>{
    const response = await apiClient.get('/list-views');
    return response.data;
}

export const getAllIssues = async () => {
    const response = await apiClient.get('/issues');
    return response.data;
};

export const createIssue = async (data: { 
    title: string; 
    description: string; 
    date: string; 
    vendor: string; 
    issueType: string; 
    status?: string; 
}) => {
    const response = await apiClient.post('/issues', data);
    return response.data;
};

export const updateIssue = async (id: number, data: { 
    status: string; 
    resolution?: string; 
}) => {
    const response = await apiClient.put(`/issues/${id}`, data);
    return response.data;
};