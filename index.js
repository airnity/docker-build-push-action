const core = require("@actions/core");
const { getAuthToken } = require("./aws");
const { dockerLogin, dockerBuild, dockerPush } = require("./docker");
// most @actions toolkit packages have async methods
async function run() {
  try {
    const imageName = core.getInput("image-name");
    const imageTag = core.getInput("image-tag");
    const dockerfilePath = core.getInput("dockerfile-path", {
      required: false,
    });
    const contextPath = core.getInput("context-path", { required: false });
    const push = core.getBooleanInput("push", { required: false });
    const region = core.getInput("ecr-region", { required: false });

    if (push) {
      const { username, password, registryUri } = await getAuthToken(region);
      dockerLogin(username, password, registryUri, false);

      // Build with registry name in front
      const imageFullname = `${registryUri}/${imageName}:${imageTag}`;
      await dockerBuild(imageFullname, dockerfilePath, contextPath);

      await dockerPush(imageFullname);

      core.setOutput("registry", registryUri);
      core.setOutput("image-fullname", imageFullname);
    } else {
      // Build without registry name in front
      const imageFullname = `${imageName}:${imageTag}`;
      await dockerBuild(imageFullname, dockerfilePath, contextPath);

      core.setOutput("image-fullname", imageFullname);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
