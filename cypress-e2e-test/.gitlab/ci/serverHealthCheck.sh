#!/bin/bash

output=
count=0
pollDuration=180
pollInterval=5
threshold=$((pollDuration / 2 / pollInterval))
apiDevServer="164.92.255.174:8001/actuator/health"
apiTestServer="139.59.136.11:8000/actuator/health"

#run until poll duration is reached
until [[ $pollDuration -lt 0 ]]; do
    output="$(curl $apiTestServer 2>&1)"
#    printf '\n%s' "$output"

  if [[ $output == *"UP"* ]]; then
    printf '\n%s' "Server is up!"
    ((count++))
  elif [[ $output == *"try"* || $output == *"not"* ]]; then
    printf '\n%s' "Invalid curl command: $output"
    exit 1
  elif [[ $output == *"Connection refused"* ]]; then
    printf '%s\n' "Connection refused at $api"
  else
    printf '\n%s' "Server is down!"
  fi

  #print status in each iteration
  printf ' %s' "Count: $count, To reach: $threshold, Maximum poll duration remaining: ${pollDuration}s."

  #will check after poll interval seconds
  sleep $pollInterval

  #success condition: $threshold is reached by $count
  if [[ $count -eq $threshold ]]; then
    printf '\n%s\n' "Command completed successfully after $threshold attempts."
    exit 0
  fi

  #decrement poll duration at the end of each iteration
  ((pollDuration = pollDuration - 5))
done

printf '\n%s\n' "Command completed but threshold not reached after $threshold attempts."
exit 1