from flask import Flask, request, render_template_string
import os
import subprocess
import pickle
import yaml

app = Flask(__name__)

# Vulnerable route with SQL injection
@app.route('/search')
def search():
    query = request.args.get('q', '')
    # Vulnerable to SQL injection
    result = f"SELECT * FROM users WHERE name = '{query}'"
    return result

# Vulnerable route with command injection
@app.route('/ping')
def ping():
    host = request.args.get('host', 'localhost')
    # Vulnerable to command injection
    result = subprocess.check_output(f'ping -c 1 {host}', shell=True)
    return result

# Vulnerable route with template injection
@app.route('/greet')
def greet():
    name = request.args.get('name', '')
    # Vulnerable to template injection
    template = f"<h1>Hello, {name}!</h1>"
    return render_template_string(template)

# Vulnerable route with pickle deserialization
@app.route('/load')
def load():
    data = request.args.get('data', '')
    # Vulnerable to pickle deserialization
    return pickle.loads(data)

# Vulnerable route with YAML deserialization
@app.route('/config')
def config():
    data = request.args.get('data', '')
    # Vulnerable to YAML deserialization
    return yaml.load(data)

if __name__ == '__main__':
    app.run(debug=True) 