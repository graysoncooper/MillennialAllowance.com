all: run

run:
	docker-compose -f docker-compose.dev.yml up -d

stop:
	docker-compose -f docker-compose.dev.yml down

logs:
	docker-compose -f docker-compose.dev.yml logs -f

ps:
	docker-compose -f docker-compose.dev.yml ps

build:
	jekyll build -w
