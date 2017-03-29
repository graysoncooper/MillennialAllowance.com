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
	gulp build

watch:
	gulp watch

deploy:
	ssh -A prod 'cd ~/MillenialAllowance.com; git pull origin master; ./prod.sh'

