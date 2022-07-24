# Continuous Integration and Continuous Deployment

**Disclaimer:** You cannot do this lab with the UTSC VM since it is not accessible by Github directly. However, this tutorial will work if you deploy on DigitalOcean Droplets, Google Compute Engine, AWS LightSail or AWS EC2, and others.

You've deployed a React and Express app, now we're missing the final final step - how do we make it easier?

**Task:** Copy your frontend and backend directories from `lab9`. 

## Build Docker image with Continuous Integration

So far, you have deployed an Express app and a React app on your own VM. But, as time goes by, you realize there is a small (or big) painpoint. Every time you make changes to your code, you'll have to SSH into your server, copy over the files, build the image again, and restart the container. That's far from ideal. In this section, we're going to utilize the [Github Container Registry](https://github.blog/2020-09-01-introducing-github-container-registry/), which stores built Docker images you can pull from anywhere (including your server). To do that, we're going to use [Github Actions](https://github.com/features/actions) to build your images.

Since we love learning by looking at examples, a readily made Github Actions workflow to build a frontend image is ready for you. To make it easier to understand, comments have been put into the file as well. To make these workflows run, move `workflows/` to `.github/workflows` so Github is able to pick it up.

Before you push the changes, you also want to generate a Personal Access Token `CR_PAT` repository secret that contains a Github Personal Access Token. (Allow read and write packages scope). Follow [this link](https://github.com/settings/tokens) to generate one, and then head into your repository settings > Secrets > Actions > New Repository Secret, and then paste in your newly generated token. Head into `build-frontend.yml` and change image name to `frontend-<your github username>`.

After you push the changes to `main`, wait a few minutes, and you'll be able to see a green checkmark beside your commit. Now, your docker image would be available to you at: `ghcr.io/UTSCC09/frontend-<your github username>`.

SSH into your VM, and authenticate with Github so Docker can pull your image.
```
server$ docker login https://ghcr.io -u <your github username> --password-stdin
<enter a generated Personal Access Token, then press enter>
```

Then, you are able to use the `docker run` command with just one small change:
```
server$ docker pull ghcr.io/UTSCC09/frontend-<your github username>
server$ docker run -d -p 80:80 ghcr.io/UTSCC09/frontend-<your github username>
```

**Task:** Setup a Github Actions workflow to build and deploy the backend on port 3000.

## Continuous Deployment with Github Actions

Once you have image building setup, it is not hard to see how to auto-deploy your applications every time you make a change. Instead of manually ssh-ing into your VM and running docker pull, Github Actions can do it on your behalf, such as with [this Action](https://github.com/appleboy/ssh-action).

**Task:** Modify the Github Actions workflow to automatically deploy both applications.

## Serving Express with nginx - reverse proxy

At this point, you should have:
- `http://<your server ip>` serving your frontend.
- `http://<you server ip>:3000` serving your backend. 

You can easily see how that is unsuitable for production. To break it down:

1. You want your server IP to be a domain instead.
2. You want to have your frontend and backend served over HTTPS.

Here are several ways to mitigate the above problems:

1. Get a domain. [Github Student Developer Pack](https://education.github.com/pack) has several offers for free.
2. In lab 6, you have learnt how to enable HTTPS with an Express middleware, however, in a production environment, serving applications through HTTPS is a job for a reverse proxy like [NGINX](https://en.wikipedia.org/wiki/Nginx).
3. Make use of NGINX as a reverse proxy to run multiple servers serving different sub domains

> Note: At this point, you should have a domain name ready, as we are about to provision an SSL certificate through
[LetsEncrypt](https://letsencrypt.org/).

**Task:** Register for a domain name, and configure the DNS for your domain name: 

- If your VM has an IP address, you should  make an `A` DNS record that points to that IP address
- if you VM has a server name, you should make a `CNAME` DNS record that points ot this server name

> Note: DNS propagation could take up to 24 hours, but nowadays it should take 10 minutes of less.

You should now be able to SSH into your server using your domain instead of the server IP.
```bash
$ ssh <username>@<your_domain_name>
```

Usually, your application does not just have a frontend and backend containers. You might also have a database (MongoDB or Postgres for example), a memory cache server (Memcached for instance), and even break down your backend and frontend into multiple microservices. In addition, we are going to deploy our application with a reverse proxy (NGINX) and automatically provision a letsencrypt certificate manager through another one-off container. 

This is a lot of container to manage! Hopefully, `docker-compose` is a helper tool for us to easily run multiple containers applications. So instead of running all container separately using `docker run` commands, you can define all configuration of all containers in one file. We have prepared a sample `docker-compose` file for you to use as-is.

Before we run the file, we'll have to find and replace several things.

- <your_email> your own email for letsencrypt renewal emails
- <your_domain_name>
- ghcr.io/UTSCC09/frontend-<your github username>
- ghcr.io/UTSCC09/backend-<your github username>

Now you're ready to run the file.
```bash
server$ docker-compose pull && docker-compose up -d
```

**Task:**  However, there are few things to change in the code again! 

- Replace your frontend API call to go to `api.<your_domain>` instead of going to the IP address or VM servername on port 3000
- Update your CORS configuration on the backend

**Task:**  And finally, update your Github Actions workflow to automatically pull and restart the docker container when changes are pushed to the repository. 
