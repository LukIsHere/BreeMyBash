#!/bin/bash
#mkdir data
#cp assets/* data/

bash ./compile.sh

echo "export breePath=$(pwd)" >> ~/.bashrc
echo "$(pwd)/load.sh" >> ~/.bashrc


source ~/.bashrc
