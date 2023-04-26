#!/bin/bash
# set -xv
issue_id=30

if [ -z "$issue_id" ]
then
    echo "Provide issue ID"
    exit 1
fi

base_url="35.154.231.200"
redmine_url="$base_url:10083"

issue_data=$(curl -s -H "Content-Type: application/json" -X GET http://$redmine_url/issues/$issue_id.json)

project_name=$(echo $issue_data | jq -r '.issue.project.name')
project_id=$(echo $issue_data | jq -r '.issue.project.id')
assigned_to_id=$(echo $issue_data | jq -r '.issue.assigned_to.id')
assigned_to_name=$(echo $issue_data | jq -r '.issue.assigned_to.name')

#echo $project_name
#echo $project_id

projectenv_data=$(curl -X GET "http://$redmine_url/issues.json?project_id=11&tracker_id=1")

# Check for sprint status
status=$(echo "$projectenv_data" | jq '.issues[].status.name' | grep -i 'sprint')
if [ -n "$status" ]; then
selected_issue=$(echo "$projectenv_data" | jq '.issues[] | select(.status.name == "sprint") | .')
else 
selected_issue=$(echo "$projectenv_data" | jq '.issues[0]')
fi
#echo $selected_issue

# repo_list=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "Repo list") | .value')
# base_container_name=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "Image name") | .value')
# ports=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "Ports") | .value')
# start_port=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "Start port") | .value')
# end_port=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "End port") | .value')

#echo $repo_list
#echo $base_container_name

developerenv_data=$(curl -X GET "http://$redmine_url/issues.json?project_id=$project_id&tracker_id=2&assigned_to_id=$assigned_to_id")
developerenv_created=$(echo "$developerenv_data" | jq '.issues')

if [[ $(echo $developerenv_data | jq '.issues | length') -eq 0 ]]; then
    echo "Developer environment ticket not created for $assigned_to_name"
    exit 1
fi

# Check for sprint status
status=$(echo "$developerenv_data" | jq '.issues[].status.name' | grep -i 'sprint')
if [ -n "$status" ]; then
selected_issue=$(echo "$developerenv_data" | jq '.issues[] | select(.status.name == "sprint") | .')
else 
selected_issue=$(echo "$developerenv_data" | jq '.issues[0]')
fi
#echo $developerenv_data

user_name=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "User") | .value')
ssh=$(echo $selected_issue | jq -r '.custom_fields[] | select(.name == "ssh key") | .value')
conatiner_name="$user_name"_"$project_id"
echo "name-----------$conatiner_name container "

#Port Configuration
                        # start=$start_port
                        # end=$end_port
                        # portlist=$ports

                        # random_port=$(( (RANDOM % (end-start+1)) + start ))

                        # # Map random port and the specified ports
                        # mapped_ports=""
                        # for (( i=0; i<${#portlist[@]}; i++ ))
                        # do
                        # port=$(( random_port+i ))
                        # mapped_ports+="-p $port:${portlist[$i]} "
                        # done

                        # echo "$mapped_ports"



# Define the port range and list of ports to map
start_port=10000
end_port=20000
ports="22,80,8080"
echo "$start_port"
echo "$end_port"
# Convert the comma-separated list of ports to an array
IFS=',' read -r -a ports_array <<< "$ports"

# Check if any port in the range or list is already in use by a Docker container
occupied_ports=$(docker ps --format '{{.Ports}}' | awk -F '->' '{print $1}' | cut -d ':' -f 2)

# Generate a random port within the specified range
generate_random_port() {
    echo $(( (RANDOM % (end_port-start_port+1)) + start_port ))
}

# Map random port and the specified ports
mapped_ports=""
for port in "${ports_array[@]}"
do
    random_port=$(generate_random_port)
    while [[ $occupied_ports =~ (^|[[:space:]])$random_port($|[[:space:]]) ]]; do
        random_port=$(generate_random_port)
    done
    mapped_ports+="$random_port:$port,"
done

# Remove the trailing comma from the mapped port list
mapped_ports=${mapped_ports%?}

echo "$mapped_ports"


# Trigger jenkins pipeline
ssh_parameter="ssh=$ssh"
build_parameters="user=$user_name&image=$base_container_name:latest&tag=latest&ports=$mapped_ports&repo_list=$repo_list"
echo "paras $build_parameters"
# echo curl -X POST --user admin:11842a3f671972d15f58ccc4fe58a6d235 \
#     --data-urlencode '"'${ssh_parameter}'"' \
#     '"'http://$base_url:8080/job/Container%20Provision/buildWithParameters?$build_parameters'"'
# curl -X POST --user admin:11842a3f671972d15f58ccc4fe58a6d235 \
#     --data-urlencode "${ssh_parameter}" \
#     "http://$base_url:8080/job/Container%20Provision/buildWithParameters?$build_parameters"        
