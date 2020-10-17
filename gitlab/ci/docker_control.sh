#!/bin/bash

docker_check () {
	local container=$(docker ps -q --filter ancestor="$CI_REGISTRY_IMAGE")
	[ -z "$container" ] && echo "Empty" || docker stop $container
}

docker_check