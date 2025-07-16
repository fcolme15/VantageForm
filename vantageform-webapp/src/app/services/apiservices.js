import { useAuth } from '../../contexts/AuthContext'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const useSportsApi = () => {
    const {getAuthHeader} = useAuth();


    const dashboardGeneralInfo = async () => {
        const headers = getAuthHeader();
        if (!headers.Authorization) return;
        console.log('past auth')
        try {
            const response = await fetch(`${API_BASE_URL}/api/sport/info`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok){
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            console.log('results', result.data);
            return result.data;
        } catch (error) {
            console.error('Error fetching sports names',error);
        }
    };

    const getPlayersBySport = async (sportName) => {
        const headers = getAuthHeader();
        if (!headers.Authorization) return;
        console.log('past auth')

        try {
            const queryParams = new URLSearchParams({
                sport: sportName,
            });
            const response = await fetch(`${API_BASE_URL}/api/sport/players?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok){
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            console.log('results', result.data);
            return result.data;
        } catch (error) {
            console.error('Error fetching sports names',error);
        }
    };

    const wrReceivingYardsElasticNetPrediction = async (playerInfo) => {

        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/elasticnet/wrreceivingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();

            return result.data;
        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    const wrReceivingYardsLightGBMPrediction = async (playerInfo) => {
        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/lightgbm/wrreceivingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();

            return result.data;
        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    const teReceivingYardsElasticNetPrediction = async (playerInfo) => {

        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/elasticnet/tereceivingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    const teReceivingYardsLightGBMPrediction = async (playerInfo) => {
        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/lightgbm/tereceivingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    const qbPassingYardsElasticNetPrediction = async (playerInfo) => {

        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/elasticnet/qbpassingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    const qbPassingYardsLightGBMPrediction = async (playerInfo) => {
        const headers = getAuthHeader();
        if (!headers.Authorization) return;

        try {
            // Add query parameters to the URL
            const playerName = playerInfo[0];
            const opponent = playerInfo[1];
            const queryParams = new URLSearchParams({
                playerName: playerName,
                opponent: opponent
            });

            const response = await fetch(`${API_BASE_URL}/prediction/lightgbm/qbpassingyards?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error, ${response.statusText}`);
            }

            const result = await response.json();
            return result.data;

        } catch (error) {
            console.error('Error fetching prediction', error);
        }
    };

    return {
        dashboardGeneralInfo, getPlayersBySport,
        wrReceivingYardsElasticNetPrediction, wrReceivingYardsLightGBMPrediction,
        teReceivingYardsElasticNetPrediction, teReceivingYardsLightGBMPrediction,
        qbPassingYardsElasticNetPrediction, qbPassingYardsLightGBMPrediction,
    };
};