# ./Dockerfile

# Extend from the official Elixir image.
FROM elixir:latest

# Create app directory and copy the Elixir projects into it.
RUN mkdir /app
COPY . /app
WORKDIR /app

# Install  npm node
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash 
RUN apt-get install -y nodejs

# Install node dependencies
RUN cd assets
RUN npm install phoenix_html
RUN npm install three
RUN npm install three.js
RUN cd ..


# Install Hex package manager.
# By using `--force`, we don’t need to type “Y” to confirm the installation.
RUN mix local.hex --force

# Compile the project.
RUN mix do compile

# Expose Phoenix server port (default is 4000)
EXPOSE 4000

ENTRYPOINT ["mix", "phx.server"]