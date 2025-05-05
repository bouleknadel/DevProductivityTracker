from flask import Flask, request, jsonify
from flask_cors import CORS  # Importez le module CORS
from robust_predictor import predict_productivity

app = Flask(__name__)
# Configurez CORS pour autoriser les requêtes depuis localhost:3000
CORS(app, resources={
    r"/predict": {
        "origins": "*",
         "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/predict', methods=['POST', 'OPTIONS'])  # Ajoutez OPTIONS
def predict():
    if request.method == 'OPTIONS':
        # Gestion des pré-vérifications CORS
        response = jsonify()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    data = request.json
    
    # Extraction des caractéristiques avec valeurs par défaut
    duration = data.get('duration', 0)
    interruptions = data.get('interruptions', 0)
    lines_written = data.get('linesWritten', 0)
    errors = data.get('errors', 0)
    
    # Prédiction
    prediction = predict_productivity(duration, interruptions, lines_written, errors)
    
    response = jsonify({
        'productivityScore': float(prediction)
    })
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)