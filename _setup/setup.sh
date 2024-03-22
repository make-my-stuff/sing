#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

echo "Setting up project dependencies"
echo "Updating: OS"
sudo apt update -y &> /dev/null

echo "Installing: apache2"
sudo apt install -y apache2 &> /dev/null

echo "Configuration: apache2.conf, 000-default.conf"
sudo cp $SCRIPT_DIR/apache2.conf /etc/apache2/
sudo cp $SCRIPT_DIR/000-default.conf /etc/apache2/sites-available/

echo "Testing setup -"
#apache2ctl -V
apache2ctl -S

echo "Starting service: apache2"
sudo service apache2 start
