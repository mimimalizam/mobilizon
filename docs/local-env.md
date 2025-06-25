Below is the Markdown conversion of the provided document:

# Mobilizion Dev Container

This document outlines the procedure for setting up a local development environment using DevContainer technology.

## Before You Start

Before you begin, ensure you have the DevContainers extension (ms-vscode-remote.remote-containers) installed in Visual Studio Code. Additionally, Docker Engine must be installed and running on your computer.

## Downloading the Source Code

The source code can be downloaded from the IT-Blokada gitlab project by executing the following command in your terminal:

```bash
git clone git@gitlab.com:it-blokada/mobilizon.git
```

Then, from the console, launch `code` by providing the path to the Mobilizion solution's source code:

```bash
code /path/to/mobilizion
```



Before proceeding with the commands below, the devcontainer, as configured in the repository (i.e., in the `.devcontainer/docker-compose.yml` file), will not work correctly.  You need to modify the Elixir version in that same file by setting the `VARIANT` argument to `"1.15.1"`. 

At this point, if you plan to work with or check data in the database, utilize the `POSTGRES_DB` setting and set it to the database name `mobilizon`. 

Below is the complete `docker-compose.yml` file after the changes: 

```yaml
version: "3.8"

services:
  elixir:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        # Elixir Version: 1.9, 1.10, 1.10.4, ...
        VARIANT: "1.15.1"
        # Phoenix Version: 1.4.17, 1.5.4, ...
        PHOENIX_VERSION: "1.6.6"
        # Node Version: 10, 11, ...
        NODE_VERSION: "16"

    volumes:
      - ..:/workspace:z
    # Runs app on the same network as the database container, allows "forwardPorts" in devcontainer.json function.
    network_mode: service:db

    # Overrides default command so things don't shut down after the process ends.
    command: sleep infinity
    environment:
      MOBILIZON_INSTANCE_NAME: My Mobilizon Instance
      MOBILIZON_INSTANCE_HOST: localhost
      MOBILIZON_INSTANCE_HOST_PORT: 4000
      MOBILIZON_INSTANCE_PORT: 4000
      MOBILIZON_INSTANCE_EMAIL: noreply@mobilizon.me
      MOBILIZON_INSTANCE_REGISTRATIONS_OPEN: "true"
      MOBILIZON_DATABASE_PASSWORD: postgres
      MOBILIZON_DATABASE_USERNAME: postgres
      MOBILIZON_DATABASE_DBNAME: mobilizon
      MOBILIZON_DATABASE_HOST: db

  db:
    image: postgis/postgis:latest
    restart: unless-stopped
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mobilizon

volumes:
  postgres-data: null
```

## Starting Dev Container

You should be ready to start your dev container. First time it will take much longer to get to the point where terminal is usable, so be patient and watch dev container extenion log for errors, just in case.

Hit `CTRL-SHIFT-P` or `CMD-SHIFT-P` and search for `Dev Containers: Open Folder in Container...` if this is your fors time or `Dev Containers: Reopen in Container` if you started at least once the container.