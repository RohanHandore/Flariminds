#!/bin/bash

# Define the port range and list of ports to map
start_port=10000
end_port=20000
ports=(22 80 8080)
ports=22,80,8080

# Check if any port in the range or list is already in use by a Docker container
is_occupied() {
    docker ps --format '{{.Ports}}' | grep -q "$1"
}

# Generate a random port within the specified range
generate_random_port() {
    echo $(( (RANDOM % (end_port-start_port+1)) + start_port ))
}

# Map random port and the specified ports
mapped_ports=""
for port in "${ports[@]}"
do
    random_port=$(generate_random_port)
    while is_occupied $random_port; do
        random_port=$(generate_random_port)
    done
    mapped_ports+="$random_port:$port,"
done

# Remove the trailing comma from the mapped port list
mapped_ports=${mapped_ports%?}

echo "$mapped_ports"
