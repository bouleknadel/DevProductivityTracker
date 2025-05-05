import pandas as pd
import joblib

# Charger le modèle avancé
model = joblib.load('advanced_productivity_model.joblib')
def predict_productivity(duration, interruptions, lines_written, errors):
    # Gestion des cas particuliers
    if duration <= 0:
        duration = 1  # Évite la division par zéro
        
    # Calculer le ratio d'erreurs par ligne
    error_ratio = errors / max(lines_written, 1)
    
    # Cas extrêmes: beaucoup d'erreurs
    if error_ratio > 1:  # Plus d'une erreur par ligne en moyenne
        return max(0, 50 - (error_ratio * 5))  # Score diminue fortement avec le ratio d'erreurs
        
    # Très peu de lignes écrites
    if lines_written <= 5:
        base_score = min(30, 30 - (errors * 3))  # Réduire davantage en cas d'erreurs
    else:
        # Calculer les features dérivées
        lines_per_minute = lines_written / duration
        errors_per_line = errors / max(lines_written, 1)
        interruptions_per_minute = interruptions / duration
        
        # Limiter les valeurs extrêmes
        lines_per_minute = min(lines_per_minute, 100)
        errors_per_line = min(errors_per_line, 10)
        interruptions_per_minute = min(interruptions_per_minute, 10)
        
        # Créer le DataFrame pour prédiction
        input_data = pd.DataFrame({
            'duration': [duration],
            'interruptions': [interruptions],
            'linesWritten': [lines_written],
            'errors': [errors],
            'lines_per_minute': [lines_per_minute],
            'errors_per_line': [errors_per_line],
            'interruptions_per_minute': [interruptions_per_minute]
        })
        
        # Utiliser le modèle pour prédire
        base_score = model.predict(input_data)[0]
    
    # Limiter la plage de score
    return max(min(base_score, 100), 0)