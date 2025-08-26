// Simple in-memory fallback store to unblock UI if backend is not wired yet
let issues = [
  {
    issue_id: 1,
    date: new Date().toISOString().split('T')[0],
    vendor: 'Acme Corp',
    issueType: 'Delay',
    description: 'Shipment delayed',
    status: 'Open',
  },
];

export async function getAllIssues() {
  return Promise.resolve([...issues]);
}

export async function createIssue(newIssue) {
  const nextId = issues.length ? Math.max(...issues.map(i => i.issue_id)) + 1 : 1;
  const created = { issue_id: nextId, ...newIssue };
  issues = [created, ...issues];
  return Promise.resolve(created);
}

export async function updateIssue(id, update) {
  issues = issues.map(i => (i.issue_id === id ? { ...i, ...update } : i));
  return Promise.resolve(issues.find(i => i.issue_id === id));
}


