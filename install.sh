#!/bin/bash
mkdir data
cp assets/* data/

bash ./compile.sh

"$(pwd)/load.sh" >> ~/.bashrc

source ~/.bashrc