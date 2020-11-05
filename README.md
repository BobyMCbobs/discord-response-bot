# Discord response bot

> send responses when certain words or exact phrases are said

## Response definitions
Example of `./responses.yaml`

```yaml
ping: pong
hello:
- greetings
- hey!
```

Note: when a field is an array (multiple possibilities), then a response will be picked randomly

## Local usage
```bash
docker run -it --rm -v "$PWD"/responses.yaml:/app/responses.yaml:z,ro --env-file .env registry.gitlab.com/bobymcbobs/discord-response-bot
```

## Building
```bash
docker build -t registry.gitlab.com/bobymcbobs/discord-response-bot:latest .
```

## Deployment in Kubernetes
Create a namespace:
```bash
kubectl create ns discord-response-bot
```

Create a secret with the Discord Client Token:
```bash
kubectl -n discord-response-bot create secret generic discord-response-bot \
  --from-literal=APP_DISCORD_CLIENT_TOKEN=MY_TOKEN_HERE
```

Install the app:
```bash
kubectl -n discord-response-bot apply -f k8s-manifests
```

Edit the configuration:
```bash
kubectl -n discord-response-bot edit configmap discord-response-bot
```

## Environment variables

| Name | Alias | Purpose | Defaults |
| - | - | - | - |
| `APP_DISCORD_CLIENT_TOKEN` | DiscordClientToken | the token to authenticate against the Discord API with | `''` |
| `APP_RESPONSES_YAML_LOCATION` | ResponsesYamlLocation | the location of the responses yaml file | `'./responses.yaml'` |

## License
Copyright 2019-2020 Caleb Woodbine.
This project is licensed under the [AGPL-3.0](http://www.gnu.org/licenses/agpl-3.0.html) and is [Free Software](https://www.gnu.org/philosophy/free-sw.en.html).
This program comes with absolutely no warranty.
