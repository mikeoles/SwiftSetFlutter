def config = [
  slackNotificationChannel: 'demo-system'
]

def releaseBranch = 'master'
def registry = 'bossanova-cloud-container.jfrog.io'
def imageName = 'demo-images/demo-ui'
def artifactoryCredential = 'jenkins_build_jumpcloud'
def tagName = "${BRANCH_NAME}-${BUILD_ID}"
def fullImageTag = ""

build(config) {
  stage('Checkout') {
    gitCheckout()
  }

  stage('Pre-Build') {
    if(env.BRANCH_NAME == releaseBranch) {
      tagName = sh(returnStdout: true, script: "grep -e 'version' package.json | grep -o -e '[0-9.]\\+'").trim()
    }

    fullImageTag = "${registry}/${imageName}:${tagName}"
  }

  stage('Build') {
    docker.build(fullImageTag)
  }

  stage('Push') {
    docker.withRegistry("https://${registry}", artifactoryCredential) {
      sh("docker push ${fullImageTag}")
    }
  }
}
