compose:
	docker-compose -f docker-compose.yml up -d --build && \
	docker-compose -f docker-compose.yml run -T wait-for-infra

compose-all:
	docker-compose -f docker-compose.yml up -d --build && \
	docker-compose -f docker-compose.yml run -T wait-for-infra && \
	docker-compose -f docker-compose.svc.yml up -d --build && \
	docker-compose -f docker-compose.svc.yml run -T wait-for-svc

test-integration:
	@docker run --rm -i \
		--network backend-network \
		-v $$(pwd):/app \
		-w /app \
		--env-file .env.test \
		node:22.16.0-alpine \
		sh -c "npm i && npm test"

compose-down:
	@docker-compose -f docker-compose.yml -f docker-compose.svc.yml down -t 10 --remove-orphans