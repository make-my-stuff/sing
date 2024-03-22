#!/bin/bash

sudo apt update
sudo apt install -y apache2
sudo cp ./apache2.conf /etc/apache2/
sudo cp ./000-default.conf /etc/apache2/sites-available/
sudo service apache2 start
