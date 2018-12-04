node("basic") {
    caughtError = 0

    try {
        stage('Checkout') {
            checkout([
                $class           : 'GitSCM',
                branches         : scm.branches,
                extensions       : scm.extensions + [
                        [$class: 'CheckoutOption', timeout: 60],
                        [
                                $class             : 'SubmoduleOption',
                                parentCredentials  : true,
                                disableSubmodules  : false,
                                recursiveSubmodules: true,
                                trackingSubmodules : false
                        ],
                        [
                                $class   : 'CloneOption',
                                noTags   : false,
                                shallow  : false,
                                depth    : 0,
                                reference: ''
                        ],
                ],
                userRemoteConfigs: scm.userRemoteConfigs
            ])
        }

        docker.image('node:11-alpine').inside {
            stage('Setup') {
                withEnv(["NPM_CONFIG_LOGLEVEL=warn"]) {
                    sh 'npm install'
                }
            }

            stage('Test') {
                withEnv(["CHROME_BIN=/usr/bin/chromium-browser"]) {
                    sh 'ng test --progress=false --watch false'
                }
                junit '**/test-results.xml'
            }

            stage('Lint') {
                sh 'ng lint'
            }
        }
        stage('Build') {
            echo 'Building....'
        }

        stage('Deploy') {
            echo 'Deploying....'
        }
    } catch (error) {
        currentBuild.result = "FAILURE"
        caughtError = error
    } finally {
        sendBuildResultStatus(currentBuild.result, 'demo-system')

        stage("Cleanup Workspace") {
            step([$class: 'WsCleanup'])
        }

        if (caughtError != 0) {
            throw caughtError
        }
    }
}
