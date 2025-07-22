from supabase import create_client, Client
from testingDataExtractor import main as getData
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import ElasticNet
import lightgbm as lgb
import pickle
import warnings
from sklearn.model_selection import GroupKFold
warnings.filterwarnings('ignore')

# WR & QB Params
lgb_params = {
    'objective': 'regression',
    'metric': 'rmse',
    'boosting_type': 'gbdt',
    'num_leaves': 100,
    'learning_rate': 0.1,
    'feature_fraction': 0.8,
    'bagging_fraction': 0.8,
    'bagging_freq': 5, 
    'verbose': -1,
    'random_state': 15,
    'force_row_wise': True,
    'min_data_in_leaf': 15,
    'lambda_l1': 0.1,
    'lambda_l2': 0.1,
    'max_depth': 10,
    'min_gain_to_split': 0.1,
}

# RB Params
# lgb_params = {
#     'objective': 'regression',
#     'metric': 'rmse',
#     'boosting_type': 'gbdt',
#     'num_leaves': 100,
#     'learning_rate': 0.1,
#     'feature_fraction': 0.8,
#     'bagging_fraction': 0.8,
#     'bagging_freq': 5, 
#     'verbose': -1,
#     'random_state': 15,
#     'force_row_wise': True,
#     'min_data_in_leaf': 15,
#     'lambda_l1': 0.1,
#     'lambda_l2': 0.1,
#     'max_depth': 10,
#     'min_gain_to_split': 0.1,
# }


exclude_columns_per_model = {
    'WR': [['receiving_tds','fantasy_points', 'fantasy_points_ppr'], 
           ['opp_def_sacks', 'receiving_tds']],
    'QB': [['team_off_passing_yards'],['team_off_passing_yards']],
    'RB': [[''], ['']],
    'TE': [[''],['']],
}

model_paths = {
    'WR': ['wrReceivingYardsLightGBM.pkl', 'wrReceivingYardsElasticNet.pkl'],
    'QB': ['qbPassingYardsLightGBM.pkl', 'qbPassingYardsElasticNet.pkl'],
    'RB': ['rbRushingYardsLightGBM.pkl', 'rbRushingYardsElasticNet.pkl'],
    'TE': ['teReceivingYardsLightGBM.pkl', 'teReceivingYardsElasticNet.pkl'],
}

def prepare_training_data(player_intervals_data):
    """
    Converts nested player data structure to flat DataFrame for training.
    
    Args:
        player_intervals_data: [[{dict},{dict}], [{dict},{dict}]] format
                              - Main list: all players
                              - Inner lists: each player's 5 intervals
                              - Dicts: individual interval data
    
    Returns:
        pandas DataFrame ready for ML training
    """
    # Flatten the nested structure
    all_samples = []
    
    for player_idx, player_intervals in enumerate(player_intervals_data):
        for interval_dict in player_intervals:
            # Add player index to track which player this sample belongs to
            interval_dict['player_idx'] = player_idx
            all_samples.append(interval_dict)
    
    # Convert to DataFrame
    df = pd.DataFrame(all_samples)
    print(df)
    
    print(f"Total samples: {len(df)}")
    print(f"Total players: {len(player_intervals_data)}")
    print(f"Average intervals per player: {len(df) / len(player_intervals_data):.1f}")
    
    return df

def create_player_based_splits(df, test_size=0.2, random_state=15):
    """
    Creates train/test splits ensuring no player appears in both sets.
    
    Args:
        df: DataFrame with 'player_idx' column
        test_size: Proportion of players to use for testing
        random_state: Random seed for reproducibility
    
    Returns:
        train_df, test_df
    """
    # Get unique players
    unique_players = df['player_idx'].unique()
    print(f"Total unique players: {len(unique_players)}")
    
    # Split players (not samples) into train/test
    train_players, test_players = train_test_split(
        unique_players, 
        test_size=test_size, 
        random_state=random_state
    )
    
    print(f"Training players: {len(train_players)}")
    print(f"Testing players: {len(test_players)}")
    
    # Create train/test DataFrames based on player splits
    train_df = df[df['player_idx'].isin(train_players)].copy()
    test_df = df[df['player_idx'].isin(test_players)].copy()
    
    print(f"Training samples: {len(train_df)}")
    print(f"Testing samples: {len(test_df)}")
    
    return train_df, test_df

def prepare_features_and_target(df, target_column, position, model):
    '''Separated exlude and target columns'''
    #Columns to exclude from features
    exclude_columns = [
        'player_idx', 
        'player_name', 
        'target_value',
        'target_week',
        'interval',
        target_column,
    ]
    
    for column in exclude_columns_per_model[position][model]:
        exclude_columns.append(column)

    # Get feature columns
    feature_columns = [col for col in df.columns if col not in exclude_columns]
    
    # Separate features and target
    X = df[feature_columns].copy()
    y = df[target_column].copy()
    
    print(f"Features: {len(feature_columns)}")
    print(f"Feature columns: {feature_columns}")
    print(f"Target shape: {y.shape}")
    
    return X, y, feature_columns

def player_based_cross_validation(df, target_column, position, n_splits=5, random_state=15):
    print(f"Starting {n_splits}-fold cross-validation...")
    
    # Prepare features and target using your existing function
    X, y, feature_columns = prepare_features_and_target(df, target_column, position, 0)
    groups = df['player_idx'].values  # Use player_idx as group identifier
    
    #Start the kfolds split
    gkf = GroupKFold(n_splits=n_splits)
    
    fold_metrics = []
    feature_importance_list = []
    # NEW: Track optimal boosting rounds from each fold
    optimal_rounds = []
    
    print(f"Total samples: {len(df)}")
    print(f"Unique players: {len(df['player_idx'].unique())}")
    
    #Perform cross-validation
    for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups), 1):
        print(f"\n--- Fold {fold} ---")
        
        #Split data. train_idx is a list and iloc returns all rows pertaining to those numbers
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
        
        #Check player separation
        train_players = set(groups[train_idx])
        val_players = set(groups[val_idx])
        
        print(f"Training players: {len(train_players)}")
        print(f"Validation players: {len(val_players)}")
        print(f"Player overlap: {len(train_players.intersection(val_players))}")
        
        #Train model using enhanced function - returns model AND optimal rounds
        model, best_rounds = train_lightgbm_model(X_train, y_train, X_val, y_val, feature_columns, random_state)
        optimal_rounds.append(best_rounds)
        
        #Evaluate model using your existing function
        metrics, y_pred = evaluate_model(model, X_val, y_val)
        
        #Store fold results
        fold_metrics.append({
            'fold': fold,
            'best_rounds': best_rounds,
            **metrics  # Unpack mae, mse, rmse, r2
        })
        
        #Store feature importance
        feature_importance = model.feature_importance(importance_type='gain')
        importance_df = pd.DataFrame({
            'feature': feature_columns,
            'importance': feature_importance,
            'fold': fold
        })
        feature_importance_list.append(importance_df)
        
        print(f"Fold {fold} - MAE: {metrics['mae']:.3f}, RMSE: {metrics['rmse']:.3f}, R²: {metrics['r2']:.3f}, Best Rounds: {best_rounds}")
    
    # Aggregate results
    metrics_df = pd.DataFrame(fold_metrics)
    
    # Calculate optimal rounds for final model
    avg_optimal_rounds = int(np.mean(optimal_rounds))
    
    print("\n" + "="*50)
    print("CROSS-VALIDATION RESULTS")
    print("="*50)
    print(f"MAE: {metrics_df['mae'].mean():.3f} ± {metrics_df['mae'].std():.3f}")
    print(f"RMSE: {metrics_df['rmse'].mean():.3f} ± {metrics_df['rmse'].std():.3f}")
    print(f"R²: {metrics_df['r2'].mean():.3f} ± {metrics_df['r2'].std():.3f}")
    print(f"Average optimal rounds: {avg_optimal_rounds} (range: {min(optimal_rounds)}-{max(optimal_rounds)})")
    
    #Average feature importance across folds
    all_importance = pd.concat(feature_importance_list)
    avg_importance = all_importance.groupby('feature')['importance'].mean().sort_values(ascending=False)
    
    return {
        'cv_metrics': metrics_df,
        'feature_importance': avg_importance,
        'feature_columns': feature_columns,
        'optimal_rounds': avg_optimal_rounds,  # NEW: For final model
        'rounds_history': optimal_rounds  # NEW: Full history
    }

def train_lightgbm_model(X_train, y_train, X_val, y_val, feature_names, random_state=15):
    """
    Trains enhanced LightGBM model with improved parameters.
    
    Args:
        X_train, y_train: Training features and target
        X_val, y_val: Validation features and target
        feature_names: List of feature column names
        random_state: Random seed
    
    Returns:
        Trained LightGBM model, best_iteration
    """
    
    #Create LightGBM datasets
    train_data = lgb.Dataset(X_train, label=y_train, feature_name=feature_names)
    valid_data = lgb.Dataset(X_val, label=y_val, reference=train_data, feature_name=feature_names)
    
    #Train model
    model = lgb.train(
        lgb_params,
        train_data,
        valid_sets=[train_data, valid_data],
        valid_names=['train', 'val'],
        num_boost_round=1000,  # Increased max rounds
        callbacks=[
            lgb.early_stopping(stopping_rounds=10),
            lgb.log_evaluation(period=0)
        ]
    )
    
    return model, model.best_iteration

def train_final_model(df, target_column, cv_results, position):
    '''Train final model using insights from cross-validation'''
    print("Training final model using CV insights...")
    
    X, y, feature_columns = prepare_features_and_target(df, target_column, position, 0)
    
    # Use the optimal rounds learned from CV
    optimal_rounds = cv_results['optimal_rounds']
    print(f"Using {optimal_rounds} boosting rounds (learned from CV)")
    
    # Create dataset
    train_data = lgb.Dataset(X, label=y, feature_name=feature_columns)
    
    # Train final model with CV-informed parameters
    final_model = lgb.train(
        lgb_params,
        train_data,
        num_boost_round=optimal_rounds,  # Use CV-learned optimal rounds
        callbacks=[lgb.log_evaluation(period=0)]
    )
    
    # NEW: Store CV insights in the model for reference
    final_model.cv_insights = {
        'optimal_rounds': optimal_rounds,
        'rounds_history': cv_results['rounds_history'],
        'cv_performance': cv_results['cv_metrics'].mean().to_dict()
    }
    
    return final_model

def evaluate_model(model, X_test, y_test):
    '''Evaluate the model using MAE, MSE, RMSE, R2'''
    y_pred = model.predict(X_test, num_iteration=model.best_iteration)
    
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    metrics = {
        'mae': mae,
        'mse': mse,
        'rmse': rmse,
        'r2': r2
    }
    
    print("\nModel Performance:")
    print(f"MAE: {mae:.3f}")
    print(f"RMSE: {rmse:.3f}")
    print(f"R²: {r2:.3f}")
    
    return metrics, y_pred

def save_model_and_artifacts(model, feature_names, cv_results, model_path, scaler=None):
    '''Saves the model and needed packaged info including CV insights'''
    
    model_package = {
        'model': model,
        'feature_names': feature_names,
        'scaler': scaler,
        'model_type': 'lightgbm',
        # NEW: Save CV insights for reference
        'cv_insights': {
            'optimal_rounds': cv_results['optimal_rounds'],
            'feature_importance': cv_results['feature_importance'],
            'cv_performance': cv_results['cv_metrics'].mean().to_dict()
        }
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(model_package, f)
    
    print(f"Model saved to: {model_path}")
    print(f"Model trained with {cv_results['optimal_rounds']} rounds (CV-informed)")

def load_model(model_path):
    with open(model_path, 'rb') as f:
        model_package = pickle.load(f)
    
    print("Model loaded successfully!")
    
    # NEW: Display CV insights if available
    if 'cv_insights' in model_package:
        insights = model_package['cv_insights']
        print(f"Model was trained with {insights['optimal_rounds']} rounds (CV-informed)")
        print(f"CV Performance - MAE: {insights['cv_performance']['mae']:.3f}, R²: {insights['cv_performance']['r2']:.3f}")
    
    return model_package

def predictReceivingYardsLightGBM(new_player_data, model_path):
    '''Makes prediction using the saved model'''
    # Load model
    model_package = load_model(model_path)
    model = model_package['model']
    feature_names = model_package['feature_names']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Make prediction - final model doesn't have best_iteration since it used optimal rounds
    prediction = model.predict([features])[0]
    
    return prediction

def train_elasticnet_model(X_train, y_train, X_val, y_val, feature_names, alpha=1.0, l1_ratio=0.5, random_state=15):
    """
    Trains ElasticNet model with standardized features.
    
    Args:
        X_train, y_train: Training features and target
        X_val, y_val: Validation features and target
        feature_names: List of feature column names
        alpha: Regularization strength
        l1_ratio: ElasticNet mixing parameter (0=Ridge, 1=Lasso)
        random_state: Random seed
    
    Returns:
        Trained ElasticNet model, scaler
    """
    
    # ElasticNet requires feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    
    # Train ElasticNet model
    model = ElasticNet(
        alpha=alpha,
        l1_ratio=l1_ratio,
        random_state=random_state,
        max_iter=2000,
        selection='cyclic'
    )
    
    model.fit(X_train_scaled, y_train)
    
    return model, scaler

def elasticnet_cross_validation(df, target_column, position, n_splits=5, alpha=1.0, l1_ratio=1.0, random_state=15):
    """
    Performs cross-validation for ElasticNet model.
    """
    print(f"Starting {n_splits}-fold cross-validation for ElasticNet...")
    
    # Prepare features and target
    X, y, feature_columns = prepare_features_and_target(df, target_column, position, 1)
    # X = X.dropna()
    # y = y.loc[X.index]
    groups = df['player_idx'].values
    
    # Start the kfolds split
    gkf = GroupKFold(n_splits=n_splits)
    
    fold_metrics = []
    feature_importance_list = []
    scalers = []  # Store scalers for ensemble if needed
    
    print(f"Total samples: {len(df)}")
    print(f"Unique players: {len(df['player_idx'].unique())}")
    
    # Perform cross-validation
    for fold, (train_idx, val_idx) in enumerate(gkf.split(X, y, groups), 1):
        print(f"\n--- Fold {fold} ---")
        
        # Split data
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
        
        # Check player separation
        train_players = set(groups[train_idx])
        val_players = set(groups[val_idx])
        
        print(f"Training players: {len(train_players)}")
        print(f"Validation players: {len(val_players)}")
        print(f"Player overlap: {len(train_players.intersection(val_players))}")
        
        # Train ElasticNet model
        model, scaler = train_elasticnet_model(X_train, y_train, X_val, y_val, feature_columns, alpha, l1_ratio, random_state)
        scalers.append(scaler)
        
        # Evaluate model
        metrics, y_pred = evaluate_elasticnet_model(model, X_val, y_val, scaler)
        
        # Store fold results
        fold_metrics.append({
            'fold': fold,
            **metrics
        })
        
        # Store feature importance (ElasticNet coefficients)
        feature_importance = np.abs(model.coef_)
        importance_df = pd.DataFrame({
            'feature': feature_columns,
            'importance': feature_importance,
            'fold': fold
        })
        feature_importance_list.append(importance_df)
        
        print(f"Fold {fold} - MAE: {metrics['mae']:.3f}, RMSE: {metrics['rmse']:.3f}, R²: {metrics['r2']:.3f}")
    
    # Aggregate results
    metrics_df = pd.DataFrame(fold_metrics)
    
    print("\n" + "="*50)
    print("CROSS-VALIDATION RESULTS (ElasticNet)")
    print("="*50)
    print(f"MAE: {metrics_df['mae'].mean():.3f} ± {metrics_df['mae'].std():.3f}")
    print(f"RMSE: {metrics_df['rmse'].mean():.3f} ± {metrics_df['rmse'].std():.3f}")
    print(f"R²: {metrics_df['r2'].mean():.3f} ± {metrics_df['r2'].std():.3f}")
    
    # Average feature importance across folds
    all_importance = pd.concat(feature_importance_list)
    avg_importance = all_importance.groupby('feature')['importance'].mean().sort_values(ascending=False)
    
    return {
        'cv_metrics': metrics_df,
        'feature_importance': avg_importance,
        'feature_columns': feature_columns,
        'alpha': alpha,
        'l1_ratio': l1_ratio,
        'scalers': scalers  # For reference
    }

def train_final_elasticnet_model(df, target_column, cv_results, position):
    '''Train final ElasticNet model using insights from cross-validation'''
    print("Training final ElasticNet model using CV insights...")
    
    X, y, feature_columns = prepare_features_and_target(df, target_column, position, 1)

    #Drop missing values
    # X = X.dropna()
    # y = y.loc[X.index]

    
    #Use the same hyperparameters from CV
    alpha = cv_results['alpha']
    l1_ratio = cv_results['l1_ratio']
    print(f"Using alpha={alpha}, l1_ratio={l1_ratio} (from CV)")
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train final ElasticNet model
    final_model = ElasticNet(
        alpha=alpha,
        l1_ratio=l1_ratio,
        random_state=15,
        max_iter=2000,
        selection='cyclic'
    )
    
    final_model.fit(X_scaled, y)
    
    # Store CV insights in the model for reference
    final_model.cv_insights = {
        'alpha': alpha,
        'l1_ratio': l1_ratio,
        'cv_performance': cv_results['cv_metrics'].mean().to_dict()
    }
    
    return final_model, scaler

def evaluate_elasticnet_model(model, X_test, y_test, scaler):
    '''Evaluate the ElasticNet model using MAE, MSE, RMSE, R2'''
    
    # Scale test features
    X_test_scaled = scaler.transform(X_test)
    y_pred = model.predict(X_test_scaled)
    
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    metrics = {
        'mae': mae,
        'mse': mse,
        'rmse': rmse,
        'r2': r2
    }
    
    print("\nElasticNet Model Performance:")
    print(f"MAE: {mae:.3f}")
    print(f"RMSE: {rmse:.3f}")
    print(f"R²: {r2:.3f}")
    
    return metrics, y_pred

def save_elasticnet_model_and_artifacts(model, feature_names, scaler, cv_results, model_path):
    '''Saves the ElasticNet model and needed packaged info including CV insights'''
    
    model_package = {
        'model': model,
        'feature_names': feature_names,
        'scaler': scaler,
        'model_type': 'elasticnet',
        # Save CV insights for reference
        'cv_insights': {
            'alpha': cv_results['alpha'],
            'l1_ratio': cv_results['l1_ratio'],
            'feature_importance': cv_results['feature_importance'],
            'cv_performance': cv_results['cv_metrics'].mean().to_dict()
        }
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(model_package, f)
    
    print(f"ElasticNet model saved to: {model_path}")
    print(f"Model trained with alpha={cv_results['alpha']}, l1_ratio={cv_results['l1_ratio']} (CV-informed)")



def predictReceivingYardsElasticNet(new_player_data, model_path):
    '''Makes prediction using the saved ElasticNet model'''
    # Load model
    model_package = load_model(model_path)
    model = model_package['model']
    feature_names = model_package['feature_names']
    scaler = model_package['scaler']
    
    # Prepare features
    features = [new_player_data.get(feat, 0) for feat in feature_names]
    
    # Scale features and make prediction
    features_scaled = scaler.transform([features])
    prediction = model.predict(features_scaled)[0]
    
    return prediction

def trainModelElasticNet(position, targetColumn, alpha=1.0, l1_ratio=0.5):
    '''Training Pipeline for ElasticNet that saves a model using CV insights'''
    print("Starting Enhanced WR Fantasy Model Training Pipeline with ElasticNet")
    print("=" * 70)
    
    #Get and prepare data
    from testingDataExtractor import main as getData
    data = getData(position) 

    #Flatten the data into a pandas df 
    preparedDatadf = prepare_training_data(data)
    
    #Run cross-validation for robust evaluation AND to learn optimal parameters
    print(f"\n2. Running cross-validation for ElasticNet (alpha={alpha}, l1_ratio={l1_ratio})...")
    cv_results = elasticnet_cross_validation(preparedDatadf, targetColumn, position, n_splits=5, alpha=alpha, l1_ratio=l1_ratio)
    
    #Train final model using CV insights
    print("\n3. Training final ElasticNet model using CV-learned parameters...")
    final_model, scaler = train_final_elasticnet_model(preparedDatadf, targetColumn, cv_results, position)
    
    #Create metrics summary
    cv_metrics = cv_results['cv_metrics']
    metrics = {
        'mae': cv_metrics['mae'].mean(),
        'rmse': cv_metrics['rmse'].mean(),
        'r2': cv_metrics['r2'].mean(),
        'alpha': cv_results['alpha'],
        'l1_ratio': cv_results['l1_ratio']
    }
    
    #Feature importance (ElasticNet coefficients)
    print("\n4. Feature importance (averaged across CV folds):")
    feature_importance = cv_results['feature_importance']
    importance_df = pd.DataFrame({
        'feature': feature_importance.index,
        'importance': feature_importance.values
    }).sort_values('importance', ascending=False)
    print(importance_df.head(10))
    
    #Save model with CV insights
    print("\n5. Saving ElasticNet model with CV insights...")
    save_elasticnet_model_and_artifacts(final_model, cv_results['feature_columns'], scaler, cv_results, model_paths[position][1])
    
    print("\nElasticNet training pipeline completed successfully!")
    print(f"Final model trained with alpha={cv_results['alpha']}, l1_ratio={cv_results['l1_ratio']} (CV-informed)")
    return final_model, metrics

def trainModelLightGBM(position, targetColumn):
    '''Training Pipeline that saves a model using CV insights'''
    print("Starting Enhanced WR Fantasy Model Training Pipeline with CV Integration")
    print("=" * 70)
    
    #Get and prepare data
    from testingDataExtractor import main as getData
    data = getData(position) 

    #Flatten the data into a pandas df 
    preparedDatadf = prepare_training_data(data)
    
    #Run cross-validation for robust evaluation AND to learn optimal parameters
    print("\n2. Running cross-validation to learn optimal training parameters...")
    cv_results = player_based_cross_validation(preparedDatadf, targetColumn, position, n_splits=5)
    
    #Train final model using CV insights
    print("\n3. Training final model using CV-learned parameters...")
    final_model = train_final_model(preparedDatadf, targetColumn, cv_results, position)
    
    #Create metrics summary
    cv_metrics = cv_results['cv_metrics']
    metrics = {
        'mae': cv_metrics['mae'].mean(),
        'rmse': cv_metrics['rmse'].mean(),
        'r2': cv_metrics['r2'].mean(),
        'optimal_rounds': cv_results['optimal_rounds']  # NEW: Include optimal rounds
    }
    
    #Feature importance
    print("\n4. Feature importance (averaged across CV folds):")
    feature_importance = cv_results['feature_importance']
    importance_df = pd.DataFrame({
        'feature': feature_importance.index,
        'importance': feature_importance.values
    }).sort_values('importance', ascending=False)
    print(importance_df.head(10))
    
    #Save model with CV insights
    print("\n5. Saving model with CV insights...")
    save_model_and_artifacts(final_model, cv_results['feature_columns'], cv_results, model_paths[position][0])
    
    print("\nTraining pipeline completed successfully!")
    print(f"Final model trained with {cv_results['optimal_rounds']} rounds (CV-informed)")
    return final_model, metrics

def main():
    manualInput = True
    if manualInput:
        position = input("Options  \nWhat position?  ")
    else:
        position = 'TE'

    target_features = {
        'WR': 'receiving_yards',
        'QB': 'passing_yards', 
        'RB': 'rushing_yards',
        'TE': 'receiving_yards',
    }

    targetFeature = target_features[position]
    
    print("=" * 50)
    print("Training LightGBM Model")
    print("=" * 50)
    lgb_model, lgb_metrics = trainModelLightGBM(position, targetFeature)
    
    print("\n" + "=" * 50)
    print("Training ElasticNet Model")
    print("=" * 50)
    en_model, en_metrics = trainModelElasticNet(position, targetFeature, alpha=1.0, l1_ratio=0.5)
    
    print("\n" + "=" * 50)
    print("MODEL COMPARISON")
    print("=" * 50)
    print(f"LightGBM - MAE: {lgb_metrics['mae']:.3f}, RMSE: {lgb_metrics['rmse']:.3f}, R²: {lgb_metrics['r2']:.3f}")
    print(f"ElasticNet - MAE: {en_metrics['mae']:.3f}, RMSE: {en_metrics['rmse']:.3f}, R²: {en_metrics['r2']:.3f}")
    

if __name__ == "__main__":
    main()