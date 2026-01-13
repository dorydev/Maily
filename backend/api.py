from flask import Flask, request, jsonify
from flask_cors import CORS

from parser import parse_recipients_from_bytes

app = Flask(__name__)
CORS(app)

@app.post("/parse-recipients")
def parse_recipients():
  if "file" not in request.files:
    return jsonify({"error": "Missing file field"}), 400
  
  f = request.files["file"]
  content = f.read()

  try:
    recipients = parse_recipients_from_bytes(content)
    return jsonify(recipients)
  except Exception as e:
    return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
