from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template("indextest001.html")


@app.route('/index', methods=['POST'])
def index():
    sentence = request.form['sentence']
    res = sentence + "hhhhh"

    return jsonify({'sentence': res})

if __name__ == '__main__':
    app.run(debug = True)