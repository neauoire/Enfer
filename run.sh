#!/bin/bash

echo "serving.."

python -m SimpleHTTPServer 8000 & 

echo "opening.."

google-chrome "http://localhost:8000/"