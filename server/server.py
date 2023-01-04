from flask import Flask
from flask import url_for
from flask import render_template
from markupsafe import escape

app = Flask(__name__)


@app.route("/")
def serveHtml():
    return url_for('static', filename='index.html')
