# Docker build and push action

<p align="center">
  <a href="https://github.com/airnity/docker-build-push-action/actions"><img alt="javscript-action status" src="https://github.com/airnity/docker-build-push-action/workflows/units-test/badge.svg"></a>
</p>

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Inputs

### `image-name`

**Required** The short name of the image (without tag, or registry).

### `image-tag`

**Required** The version tag of the image.

### `dockerfile-path`

The path where to find the dockerfile (default: `./Dockerfile`).

### `context-path`

The path where to run the `docker build` command.

### `push`

If `True` image will be push to ECR in the `ecr-region` defined, in the AWS account the runner is deployed in.

### `ecr-region`

The AWS ECR region to push the image in.
**Required** if push is `True`

### `latest`

Wether to also tag image as latest or not.

## Outputs

### `registry`

The name of the registry where image has been pushed.

### `image-fullname`

The full name of the image with registry and tag.

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: airnity/docker-build-push-action@v1
with:
  image-name: my-image # Required
  image-tag: v1.1.0 # Required
  dockerfile-path: ./images/Dockerfile
  context-path: ./build/
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:
