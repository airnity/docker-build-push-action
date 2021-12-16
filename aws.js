const aws = require("aws-sdk");

const getAuthToken = async function (region) {
  const ecr = new aws.ECR({
    customUserAgent: "amazon-ecr-login-for-github-actions",
    region: region,
  });

  const authTokenRequest = {};

  const authTokenResponse = await ecr
    .getAuthorizationToken(authTokenRequest)
    .promise();

  if (
    !Array.isArray(authTokenResponse.authorizationData) ||
    !authTokenResponse.authorizationData.length
  ) {
    throw new Error(
      "Could not retrieve an authorization token from Amazon ECR"
    );
  }

  const authData = authTokenResponse.authorizationData[0];
  const authToken = Buffer.from(authData.authorizationToken, "base64").toString(
    "utf-8"
  );
  const creds = authToken.split(":", 2);
  const proxyEndpoint = authData.proxyEndpoint;
  const registryUri = proxyEndpoint.replace(/^https?:\/\//, "");

  return { username: creds[0], password: creds[1], registryUri: registryUri };
};

exports.getAuthToken = getAuthToken;
