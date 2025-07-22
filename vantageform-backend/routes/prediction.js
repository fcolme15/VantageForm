const express = require('express');
const { authenticateToken } = require("../middleware/auth");
const databaseService = require('../services/database');
const router = express.Router();

// Public route
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Prediction working' });
});

//WR Models API

router.get('/elasticnet/wrreceivingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/receivingYardsWrElasticnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const elasticnetResult = await apiResponse.json();

        res.json({
            message: 'ElasticNet prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: elasticnetResult.prediction,
                fullResponse: elasticnetResult
            }
        });

    } catch (error) {
        console.error('ElasticNet prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

router.get('/lightgbm/wrreceivingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/receivingYardsWrLightgbm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const lightgbmResult = await apiResponse.json();

        res.json({
            message: 'LightGBM prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: lightgbmResult.prediction,
                fullResponse: lightgbmResult
            }
        });

    } catch (error) {
        console.error('LightGBM prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

//TE Models API

router.get('/elasticnet/tereceivingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/receivingYardsTeElasticnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const elasticnetResult = await apiResponse.json();

        res.json({
            message: 'ElasticNet prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: elasticnetResult.prediction,
                fullResponse: elasticnetResult
            }
        });

    } catch (error) {
        console.error('ElasticNet prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

router.get('/lightgbm/tereceivingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/receivingYardsTeLightgbm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const lightgbmResult = await apiResponse.json();

        res.json({
            message: 'LightGBM prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: lightgbmResult.prediction,
                fullResponse: lightgbmResult
            }
        });

    } catch (error) {
        console.error('LightGBM prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

//QB Models API

router.get('/elasticnet/qbpassingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/passingYardsQbElasticnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const elasticnetResult = await apiResponse.json();

        res.json({
            message: 'ElasticNet prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: elasticnetResult.prediction,
                fullResponse: elasticnetResult
            }
        });

    } catch (error) {
        console.error('ElasticNet prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

router.get('/lightgbm/qbpassingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/passingYardsQbLightgbm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const lightgbmResult = await apiResponse.json();

        res.json({
            message: 'LightGBM prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: lightgbmResult.prediction,
                fullResponse: lightgbmResult
            }
        });

    } catch (error) {
        console.error('LightGBM prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

//RB Models API

router.get('/elasticnet/rbrushingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/rushingYardsRbElasticnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const elasticnetResult = await apiResponse.json();

        res.json({
            message: 'ElasticNet prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: elasticnetResult.prediction,
                fullResponse: elasticnetResult
            }
        });

    } catch (error) {
        console.error('ElasticNet prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

router.get('/lightgbm/rbrushingyards', authenticateToken, async (req, res) => {
    try {
        const { playerName, opponent } = req.query;
        console.log("playerName", playerName);
        console.log(playerName, opponent);

        const playerData = await databaseService.getPlayerAvgData(playerName, opponent);
        if (!playerData.success) {
            return res.status(400).json({
                error: 'Failed to retrieve player data',
                details: playerData.error
            });
        }

        const flattened = databaseService.flattenPlayerData(
            playerData.data.playerData,
            playerData.data.playerInfo,
            playerData.data.defensiveTeamData,
            playerData.data.offensiveTeamData
        );

        console.log(flattened);

        // Call the external API
        const apiResponse = await fetch('https://vantageform-nfl-api.onrender.com/predict/rushingYardsRbLightgbm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flattened)
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({
                error: 'External API error',
                details: `API returned ${apiResponse.status}: ${await apiResponse.text()}`
            });
        }

        const lightgbmResult = await apiResponse.json();

        res.json({
            message: 'LightGBM prediction retrieved successfully',
            data: {
                player: playerName,
                prediction: lightgbmResult.prediction,
                fullResponse: lightgbmResult
            }
        });

    } catch (error) {
        console.error('LightGBM prediction route error', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});


module.exports = router;