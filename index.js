const core = require("@actions/core");
const { getAuthToken } = require("./aws");
const { dockerLogin, dockerBuild, dockerPush } = require("./docker");
// most @actions toolkit packages have async methods
async function run() {
  try {
    const inputImageName = core.getInput("image-name");
    const inputImageTag = core.getInput("image-tag");
    const inputDockerfilePath = core.getInput("dockerfile-path", {
      required: false,
    });
    const inputContextPath = core.getInput("context-path", { required: false });
    const inputPush = core.getBooleanInput("push", { required: false });
    const inputRegion = core.getInput("ecr-region", { required: false });

    if (inputPush) {
      const { username, password, registryUri } = await getAuthToken(
        inputRegion
      );
      await dockerLogin(username, password, registryUri, false);

      // Build with registry name in front
      const imageName = `${registryUri}/${inputImageName}`;
      const imageFullname = `${imageName}:${inputImageTag}`;
      await dockerBuild(imageFullname, inputDockerfilePath, inputContextPath);

      await dockerPush(imageFullname);

      core.setOutput("registry", registryUri);
      core.setOutput("image-name", imageName);
      core.setOutput("image-tag", inputImageTag);
      core.setOutput("image-fullname", imageFullname);
    } else {
      // Build without registry name in front
      const imageName = `${inputImageName}`;
      const imageFullname = `${imageName}:${inputImageTag}`;
      await dockerBuild(imageFullname, inputDockerfilePath, inputContextPath);

      core.setOutput("image-name", imageName);
      core.setOutput("image-tag", inputImageTag);
      core.setOutput("image-fullname", imageFullname);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
