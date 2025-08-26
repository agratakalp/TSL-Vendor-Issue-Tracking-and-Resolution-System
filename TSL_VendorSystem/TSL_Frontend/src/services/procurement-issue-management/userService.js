let users = [
  { id: 1, username: 'logger@gmail.com', role: 'logger' },
  { id: 2, username: 'resolver@gmail.com', role: 'resolver' },
  { id: 3, username: 'admin@gmail.com', role: 'admin' },
];

export async function getAllUsers() {
  return Promise.resolve([...users]);
}

export async function createUser(user) {
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const toCreate = { id: nextId, username: user.username, role: user.role };
  users = [...users, toCreate];
  return Promise.resolve(toCreate);
}

export async function updateUser(id, update) {
  users = users.map(u => (u.id === id ? { ...u, ...update } : u));
  return Promise.resolve(users.find(u => u.id === id));
}

export async function deleteUser(id) {
  users = users.filter(u => u.id !== id);
  return Promise.resolve();
}


