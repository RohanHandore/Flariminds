#!/bin/bash

# Set the API endpoint URL
API_URL="http://35.154.231.200:10083/issues.json"

# Make the API request and get the response data
response=$(curl -s "$API_URL")

# Use jq to filter issues that do not have an assignee and extract only the 'id' field
filtered_data=$(echo "$response" | jq '.issues | map(select(.assigned_to == null)) | .[].id')

# Print the filtered data
echo "$filtered_data"
