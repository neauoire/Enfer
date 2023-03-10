#!/bin/sh -e

echo "Starting.."

python3 -m http.server &
firefox http://localhost:8000/
