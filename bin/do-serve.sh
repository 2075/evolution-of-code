#!/bin/bash

PROJECT_ROOT=$(realpath $(dirname $(dirname "$0")));


cd $PROJECT_ROOT;
python -m http.server 1337;

