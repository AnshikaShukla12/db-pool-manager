#!/bin/bash


echo "Adjusting Pool Size...."

POOL_SIZE=$1

echo "New Pool Size: $POOL_SIZE"

node scripts/updatePool.js $POOL_SIZE

echo "Pool configuration updated successfully"
