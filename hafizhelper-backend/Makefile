server:
	python3 manage.py runserver

makemigrations:
	python3 manage.py makemigrations

migrate:
	python3 manage.py migrate

test:
	coverage run manage.py test

format:
	black .; isort .; flake8 .

.PHONY: server makemigrations migrate test format