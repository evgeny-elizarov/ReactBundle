#!/bin/bash
docker login registry.andevis.ee
docker build -t registry.andevis.ee/andevis/reactbundle .
docker push registry.andevis.ee/andevis/reactbundle
