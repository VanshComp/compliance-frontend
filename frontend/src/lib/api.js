export async function apiGetProfile() {
const token = localStorage.getItem('centura_token') || sessionStorage.getItem('centura_token');
const res = await fetch('/api/auth/profile', { headers: { Authorization: token ? `Bearer ${token}` : '' } });
if (!res.ok) throw new Error('Unauthorized');
return res.json();
}