#!/bin/sh
echo "Chowning /data/db"
chown -R mongodb:mongodb /data/db
echo "Starting mongod"
mongod --bind_ip_all --dbpath /data/db
echo "Mongod exited"