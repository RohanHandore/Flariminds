




import groovy.json.JsonOutput

node {
  stage('SCM') {
    git branch: 'main', url: 'http://172.31.25.253:3000/fmreval/python.git'
  }
  stage('get env var'){
    sh '''
    printenv
    '''
    env.getEnvironment().each { name, value -> println "Name: $name -> Value $value" }
  }
  stage('SonarQube analysis') {
    def scannerHome = tool 'sonarqube'
    withSonarQubeEnv('sonarqube') {
      sh "${scannerHome}/bin/sonar-scanner \
        -X \
        -Dsonar.projectKey=pythonapp \
        -Dsonar.sources=."
    }
  }
  stage("Quality Gate") {
    def qg = waitForQualityGate()
    def status = qg.getStatus()
    env.SONAR_QG_STATUS = qg.status
    def pn=env.CHANGE_ID

    sh '''#!/usr/bin/env bash
    qg=''' + env.SONAR_QG_STATUS + '''
    pn=''' + env.CHANGE_ID + '''
    sonar_measures=$(curl -X GET -u "admin:fmreval" -s "http://172.31.25.253:9000/api/measures/component.json?component=pythonapp&metricKeys=bugs,vulnerabilities,security_hotspots,code_smells")
    echo "$sonar_measures"
    md=$(echo "${sonar_measures}" | jq -r '.component.measures[] | .metric + "|" + .value  ')
    op=$(echo -e "Metric | Value \n---- | ----:\n${md}")
    body=$(echo "Quality gate is $qg \n\nMeasures are\n${op}")
    echo $body
    echo curl -X POST -H "Authorization: token b31a54828a43c585ceaa70cfe5c1e0a2d773e7cb" \
    -H "Content-Type: application/json" \
    -d "{\\\"body\\\": \\\"$body\\\"}"
    curl -X POST -H "Authorization: token b31a54828a43c585ceaa70cfe5c1e0a2d773e7cb" \
    -H "Content-Type: application/json" \
    -d "{\\\"body\\\": \\\"$body\\\"}" \
    "http://172.31.25.253:3000/api/v1/repos/fmreval/python/issues/$pn/comments"

       if [ "$qg" == "OK" ]; then
        curl -X PUT -H "Content-Type: application/json" \
             -H "X-Redmine-API-Key: 27e393416f51047746d473d52cc81d34b83f04da" \
             -d '{"issue": {"notes": "quality gate in ok"}}' \
             http://35.154.231.200:10083/issues/$pn.json -v
    else
        curl -X PUT -H "Content-Type: application/json" \
             -H "X-Redmine-API-Key: 27e393416f51047746d473d52cc81d34b83f04da" \
             -d '{"issue": {"notes": "quality gate failed"}}' \
             http://35.154.231.200:10083/issues/$pn.json -v
    fi


    '''
    
  }
}