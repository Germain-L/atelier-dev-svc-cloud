export const refreshAuthentication = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};