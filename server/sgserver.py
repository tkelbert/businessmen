import http.server
import json
import os
import random
import asyncio


class APIHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):

        # Determine the file to send based on the request path
        if self.path == '/':
            file_to_send = 'index.html'
            content_type = 'text/html'
        elif self.path == '/index.js':
            file_to_send = 'index.js'
            content_type = 'text/javascript'
        elif self.path == '/style.css':
            file_to_send = 'style.css'
            content_type = 'text/css'
        else:
            # Send a 404 Not Found response if the file is not found
            self.send_response(404)
            self.end_headers()
            return

        # Construct the full path to the file
        file_path = os.path.join(os.path.dirname(__file__), '..', file_to_send)

        # Read the contents of the file to send
        with open(file_path, 'rb') as f:
            file_contents = f.read()

        # Send a 200 OK response with the file contents
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        # get it past cors
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
        self.wfile.write(file_contents)

    def do_POST(self):

        # Read the request body
        content_length = int(self.headers['Content-Length'])
        request_body = self.rfile.read(content_length)

        # Parse the request body as JSON
        request_data = json.loads(request_body)

        # Print the request data
        print(request_data)

        # check if board is full(or later check if there's a win condition)
        full = True
        for sq in request_data['board']:
            if sq == " ":
                full = False
                break

        if (full):
            self.send_response(288)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            return

        # Pick a random empty square to add a value to
        rand = random.randint(0, 8)
        while request_data['board'][rand] != " ":
            rand = random.randint(0, 8)

        botsChoice = 'E'
        if request_data['userChoice'] == "X":
            botsChoice = "O"
        else:
            botsChoice = "X"
        request_data['board'][rand] = botsChoice

        # Serialize the modified data as a JSON string
        modified_data = json.dumps(request_data)

        # Send a 200 OK response with the modified data
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        # get it past cors
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()
        modified_data_bytes = bytes(modified_data, 'utf-8')
        self.wfile.write(modified_data_bytes)


async def runServer():
    ip = 'localhost'
    # ip = '172.31.1.21'
    port = 5050
    server = http.server.HTTPServer((ip, port), APIHandler)
    await server.serve_forever()


asyncio.run(runServer())
