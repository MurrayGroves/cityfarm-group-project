#!/bin/python3

from flask import Flask, request, Response
import os
import subprocess

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def respond():
    output = subprocess.getoutput("git fetch --dry-run").strip()
    if output == "":
        print("No changes")
        return Response(status=204)
    
    else:
        print("Changes found")
        # Update local git log
        os.system("git fetch")
        os.system("git pull")

        # Update and restart docker containers
        os.system("docker-compose down")
        os.system("docker-compose pull")
        os.system("docker-compose up -d")
        return Response(status=200)
    
@app.route("/force", methods=["POST"])
def respond():
    print("Force update")
    # Update local git log
    os.system("git fetch")
    os.system("git pull")

    # Update and restart docker containers
    os.system("docker-compose down")
    os.system("docker-compose pull")
    os.system("docker-compose up -d")
    return Response(status=200)
    


if __name__ == '__main__':
    app.run(host="localhost", port=1726, debug=True)