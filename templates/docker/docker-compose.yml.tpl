version: '3.8'

services:
  wa-bot:
    build: .
    container_name: {{projectName}}
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ./wa-auth:/app/wa-auth
    ports:
      - "{{port}}:{{port}}"
