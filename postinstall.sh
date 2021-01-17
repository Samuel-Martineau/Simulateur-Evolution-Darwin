#!/usr/bin/env bash

if [ "$PLATFORM" != "DOCKER" ]; then
  husky install
fi