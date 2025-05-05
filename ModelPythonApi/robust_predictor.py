
import pandas as pd
import numpy as np
import joblib

# Charger le modèle entraîné
model = joblib.load('robust_productivity_model.joblib')

def predict_productivity(duration, interruptions, linesWritten, errors):
    """
    Fonction robuste de prédiction de productivité qui gère correctement les cas extrêmes.
    
    Args:
        duration: Durée de la session en minutes
        interruptions: Nombre d'interruptions
        linesWritten: Nombre de lignes écrites
        errors: Nombre d'erreurs
        
    Returns:
        Un score de productivité entre 0 et 100
    """
    # Gestion des cas particuliers
    if duration <= 0:
        duration = 1  # Éviter division par zéro
    
    # Calculer le ratio d'erreurs
    error_ratio = errors / max(linesWritten, 1)
    
    # CAS EXTRÊMES: application de règles métier
    
    # 1. Cas avec beaucoup d'erreurs par rapport aux lignes
    if error_ratio > 2:
        return max(0, 30 - (error_ratio * 5))
    
    # 2. Sessions très courtes avec beaucoup d'erreurs
    if duration < 5 and errors > linesWritten:
        return max(0, 40 - errors)
    
    # 3. Très peu de lignes écrites
    if linesWritten <= 3:
        return max(0, 30 - (errors * 10))
    
    # CAS NORMAUX: utiliser le modèle ML
    
    # Calculer les features dérivées
    lines_per_minute = linesWritten / duration
    errors_per_line = errors / max(linesWritten, 1)
    interruptions_per_minute = interruptions / duration
    
    # Limiter les valeurs extrêmes
    lines_per_minute = min(lines_per_minute, 10)
    errors_per_line = min(errors_per_line, 5)
    interruptions_per_minute = min(interruptions_per_minute, 10)
    
    # Préparer les données pour la prédiction
    input_data = pd.DataFrame({
        'duration': [duration],
        'interruptions': [interruptions],
        'linesWritten': [linesWritten],
        'errors': [errors],
        'lines_per_minute': [lines_per_minute],
        'errors_per_line': [errors_per_line],
        'interruptions_per_minute': [interruptions_per_minute]
    })
    
    # Obtenir la prédiction du modèle
    prediction = model.predict(input_data)[0]
    
    # Ajustements supplémentaires pour plus de robustesse
    if linesWritten < 10 and prediction > 70:
        prediction = 70  # Limiter les scores élevés pour peu de lignes
    
    # Limiter la plage de score
    return max(0, min(100, prediction))

# Exemple d'utilisation
if __name__ == "__main__":
    # Test avec quelques valeurs
    print(f"Normal (60min, 2 interruptions, 120 lignes, 2 erreurs): {predict_productivity(60, 2, 120, 2):.2f}")
    print(f"Problématique (0min, 0 interruptions, 6 lignes, 40 erreurs): {predict_productivity(0, 0, 6, 40):.2f}")
