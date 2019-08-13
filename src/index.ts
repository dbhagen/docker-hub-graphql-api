import { APIGatewayProxyHandler } from 'aws-lambda'
import { queryTopRepos } from './handlers/DockerHub'
import { DOCKER_USERNAME } from './utils/constants'
import log from './utils/log'

if (!DOCKER_USERNAME) {
  log.fatal('Missing required parameters.')
  process.exit(1)
}

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2,
    ),
  }
}

export const queryDockerHub = async (event, context, callback) => {
  // @ts-ignore
  const { topRepos, totalPulls } = await queryTopRepos(DOCKER_USERNAME)

  const response = {
    body: JSON.stringify({ topRepos, totalPulls }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
  }

  return callback(null, response)
}
