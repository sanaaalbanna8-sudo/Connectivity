from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".html": "text/html",
    }

if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("127.0.0.1", 8770), Handler)
    print("http://127.0.0.1:8770/", flush=True)
    httpd.serve_forever()
