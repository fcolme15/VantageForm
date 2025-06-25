'use client'
import { useAuth } from '../../contexts/AuthContext'

const ApiTestComponent = () => {
  const { getAuthHeader, session, user } = useAuth();

  const testApiCall = async () => {
    console.log('🔑 Current user:', user);
    console.log('🔑 Current session:', session);
    
    const headers = getAuthHeader();
    console.log('🔑 Auth headers:', headers);
    
    if (!headers.Authorization) {
      console.error('❌ No auth token - user not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📦 API Response:', data);
      
    } catch (error) {
      console.error('💥 Error:', error);
    }
  };

  return (
    <div>
      <button onClick={testApiCall}>Test API with Supabase Auth</button>
      <p>User: {user ? user.email : 'Not logged in'}</p>
    </div>
  );
};

export default ApiTestComponent;