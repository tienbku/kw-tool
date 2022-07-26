# Keyword Tool

The open source version of the original keyword tool code by SEO Ruler.

You can support further development on [Patreon](https://www.patreon.com/_pablodev)

Hacked together by [Pablo Rosales](http://github.com/pablorosales) on my free time.

## Features

Includes features like:

* Find low-hanging fruits (easy win score)
* Keyword Volume with Keywords Everywhere
* Keyword semantic clustering
* Keyword SERP clustering
* Bulk SERP Analysis
* Quick rankings check for all keywords
* Keyword Grouping (manual)
* Bulk PAA include
* Intent grouping
* Modifiers/Common terms, verbs and modifier ideas

<img alt="Screenshot" src="./screenshot.png" width="800" />
<img alt="Screenshot" src="./screenshot-2.png" width="800" />

## Env file (configuration)

Add a file on `app/.env.dev` with this (updated with your credentials):

```dotenv
SENTENCE_TRANSFORMERS_HOME=/tmp/.cache
MONGO_DB=seo-ruler
MONGO_URI=mongodb://mongo:27017
PORT=8081
DEBUG=express:*
CHECKPOINT_DISABLE=1
GOOGLE_APPLICATION_CREDENTIALS=/home/node/creds.json
REDIS_URI=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_ENABLED=1
BODY_PARSER_LIMIT=100kb
COOKIE_DOMAIN=localhost
SERVER_PORT=8080
DOMAIN=http://localhost:8080
SERVER_URL=http://localhost:8080
CLIENT_ORIGIN_URL=http://localhost:8080
APP_URL=http://localhost:8000
GOOGLE_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36"

# Update this ones to the actual values inside the quotes, you need all for all features to work
GOOGLE_API_KEY="<your google api key>"
D4S_API_USER="<your d4s api user>"
D4S_API_PASS="<your d4s api pass>"
KE_KEY="<your keywords everywhere key>"
BROWSERLESS_API="<your browserless api key>"
SESSION_SECRET="<a random string>"
OPENAI_API_KEY="<your openai api key>"
HUGGINGFACE_API_KEY="<your huggingface api key>"
```

## Running the web app

* Install Docker (with Docker Compose)
* Run on the root of the project: `docker-compose up -d`
* Go to the browser and open `http://localhost:8080`

## License

See [LICENSE](LICENSE).
