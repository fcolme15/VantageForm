from fastapi import FastAPI, HTTPException
import pickle
from pydantic import BaseModel
from typing import Dict, Any
from contextlib import asynccontextmanager
import os

# Global variables for models
elasticnet_receiving_yards_wr_model = None
lightgbm_receiving_yards_wr_model = None
elasticnet_receiving_yards_te_model = None
lightgbm_receiving_yards_te_model = None
elasticnet_passing_yards_qb_model = None
lightgbm_passing_yards_qb_model = None
elasticnet_rushing_yards_rb_model = None
lightgbm_rushing_yards_rb_model = None

def load_model(model_path):
    """Load model package from pickle"""
    with open(model_path, 'rb') as f:
        model_package = pickle.load(f)
    return model_package

def predictElasticNet(new_player_data, model_package):
    """Makes prediction using the saved receiving yard ElasticNet model"""
    model = model_package['model']
    feature_names = model_package['feature_names']
    scaler = model_package['scaler']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Scale features and make prediction
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]
    return prediction

def predictLightGBM(new_player_data, model_package):
    """Makes prediction using the saved LightGBM model"""
    model = model_package['model']
    feature_names = model_package['feature_names']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Make prediction
    prediction = model.predict([features])[0]
    return prediction

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global elasticnet_receiving_yards_wr_model, lightgbm_receiving_yards_wr_model
    global elasticnet_receiving_yards_te_model, lightgbm_receiving_yards_te_model
    global elasticnet_passing_yards_qb_model, lightgbm_passing_yards_qb_model
    # global elasticnet_rushing_yards_rb_model, lightgbm_rushing_yards_rb_model
    
    try:
        elasticnet_receiving_yards_wr_model = load_model('wrReceivingYardsElasticNet.pkl')
        lightgbm_receiving_yards_wr_model = load_model('wrReceivingYardsLightGBM.pkl')

        elasticnet_receiving_yards_te_model = load_model('teReceivingYardsElasticNet.pkl')
        lightgbm_receiving_yards_te_model = load_model('teReceivingYardsLightGBM.pkl')

        elasticnet_passing_yards_qb_model = load_model('qbPassingYardsElasticNet.pkl')
        lightgbm_passing_yards_qb_model = load_model('qbPassingYardsLightGBM.pkl')

        # elasticnet_rushing_yards_rb_model = load_model('rbRushingYardsElasticNet.pkl')
        # lightgbm_rushing_yards_rb_model = load_model('rbRushingYardsLightGBM.pkl')
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {e}")
    
    yield
    
    # Shutdown
    # Models will be garbage collected automatically

app = FastAPI(title="Receiving Yards Prediction API", lifespan=lifespan)

# Pydantic model for input validation
class PlayerData(BaseModel):
    class Config:
        extra = "allow"  # Allow additional fields not explicitly defined

@app.get("/")
async def root():
    return {"message": "Prediction API is running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "elasticnet_loaded": elasticnet_receiving_yards_wr_model is not None,
        "lightgbm_loaded": lightgbm_receiving_yards_wr_model is not None
    }

############################################################################
# WR Models and API Endpoints
############################################################################

@app.post("/predict/receivingYardsWrElasticnet")
async def predict_elasticnet(player_data: Dict[str, Any]):
    if elasticnet_receiving_yards_wr_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    try:
        prediction = predictElasticNet(player_data, elasticnet_receiving_yards_wr_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/receivingYardsWrLightgbm")
async def predict_lightgbm(player_data: Dict[str, Any]):
    if lightgbm_receiving_yards_wr_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    try:
        prediction = predictLightGBM(player_data, lightgbm_receiving_yards_wr_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/model/wrElasticnet/features")
async def get_elasticnet_features():
    if elasticnet_receiving_yards_wr_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    return {"features": elasticnet_receiving_yards_wr_model['feature_names']}

@app.get("/model/wrLightgbm/features")
async def get_lightgbm_features():
    if lightgbm_receiving_yards_wr_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    return {"features": lightgbm_receiving_yards_wr_model['feature_names']}

############################################################################
# TE Models and API Endpoints
############################################################################

@app.post("/predict/receivingYardsTeElasticnet")
async def predict_elasticnet(player_data: Dict[str, Any]):
    if elasticnet_receiving_yards_te_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    try:
        prediction = predictElasticNet(player_data, elasticnet_receiving_yards_te_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/receivingYardsTeLightgbm")
async def predict_lightgbm(player_data: Dict[str, Any]):
    if lightgbm_receiving_yards_te_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    try:
        prediction = predictLightGBM(player_data, lightgbm_receiving_yards_te_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/model/teElasticnet/features")
async def get_elasticnet_features():
    if elasticnet_receiving_yards_te_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    return {"features": elasticnet_receiving_yards_te_model['feature_names']}

@app.get("/model/teLightgbm/features")
async def get_lightgbm_features():
    if lightgbm_receiving_yards_te_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    return {"features": lightgbm_receiving_yards_te_model['feature_names']}
    
############################################################################
# QB Models and API Endpoints
###########################################################################

@app.post("/predict/passingYardsQbElasticnet")
async def predict_elasticnet(player_data: Dict[str, Any]):
    if elasticnet_passing_yards_qb_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    try:
        prediction = predictElasticNet(player_data, elasticnet_passing_yards_qb_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/passingYardsQbLightgbm")
async def predict_lightgbm(player_data: Dict[str, Any]):
    if lightgbm_passing_yards_qb_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    try:
        prediction = predictLightGBM(player_data, lightgbm_passing_yards_qb_model)
        return {"prediction": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/model/qbElasticnet/features")
async def get_elasticnet_features():
    if elasticnet_passing_yards_qb_model is None:
        raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
    return {"features": elasticnet_passing_yards_qb_model['feature_names']}

@app.get("/model/qbLightgbm/features")
async def get_lightgbm_features():
    if lightgbm_passing_yards_qb_model is None:
        raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
    return {"features": lightgbm_passing_yards_qb_model['feature_names']}
    
############################################################################
# RB Models and API Endpoints
############################################################################

# @app.post("/predict/rushingYardsRbElasticnet")
# async def predict_elasticnet(player_data: Dict[str, Any]):
#     if elasticnet_rushing_yards_rb_model is None:
#         raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
#     try:
#         prediction = predictElasticNet(player_data, elasticnet_rushing_yards_rb_model)
#         return {"prediction": float(prediction)}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# @app.post("/predict/rushingYardsRbLightgbm")
# async def predict_lightgbm(player_data: Dict[str, Any]):
#     if lightgbm_rushing_yards_rb_model is None:
#         raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
#     try:
#         prediction = predictLightGBM(player_data, lightgbm_rushing_yards_rb_model)
#         return {"prediction": float(prediction)}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# @app.get("/model/rbElasticnet/features")
# async def get_elasticnet_features():
#     if elasticnet_rushing_yards_rb_model is None:
#         raise HTTPException(status_code=500, detail="ElasticNet model not loaded")
    
#     return {"features": elasticnet_rushing_yards_rb_model['feature_names']}

# @app.get("/model/rbLightgbm/features")
# async def get_lightgbm_features():
#     if lightgbm_rushing_yards_rb_model is None:
#         raise HTTPException(status_code=500, detail="LightGBM model not loaded")
    
#     return {"features": lightgbm_rushing_yards_rb_model['feature_names']}
    