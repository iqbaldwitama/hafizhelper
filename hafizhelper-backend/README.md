<div align="center" style="padding-bottom: 20px">
  <h1>Hafiz-Helper Backend</h1>
  <img src="https://img.shields.io/badge/Python-3.12-14354C?style=for-the-badge&logo=python" alt=""/>
  <img src="https://img.shields.io/badge/Django-5.0.1-092E20?style=for-the-badge&logo=django" alt=""/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&labelColor=Blue"" alt=""/>
  <img src="https://img.shields.io/badge/Docker-008FCC?style=for-the-badge&logo=docker&logoColor=white" alt=""/>
  <img alt="Google Cloud" src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white"/>
  <img src="https://img.shields.io/badge/code%20style-black-000000.svg?style=for-the-badge" alt=""/>
</div>

![Pipeline](https://gitlab.cs.ui.ac.id/ppl-7/hafizhelper-backend/badges/main/pipeline.svg) ![Coverage](https://gitlab.cs.ui.ac.id/ppl-7/hafizhelper-backend/badges/main/coverage.svg)

## Setup Development Environment

### Requirements

- virtualenv
- pip >= 23

### Steps

- Install [pre-commit](https://pre-commit.com/) hook (for linting) using this command after installing the requirements
  in virtual env

```shell
pre-commit install
```

- Create .env file (example in .env.example)

```shell script
cd hafizhelper-backend
python -m venv venv
```

> Note: please adjust the command with the `python` executable on your
> computer, because sometimes (example: on Ubuntu or macOS) Python 3
> can only be executed using `python3`, not `python`.

Activate the virtual environment that was just created
On Windows:

```shell
venv\Scripts\activate
```

On Linux/macOS:

```shell
source venv/bin/activate
```

If successful, there should be `(venv)` in your cmd/terminal prompt.

Install the required packages with the following command.

```shell script
pip install -r requirements.txt
```

Run django application through Makefile

```shell script
make server
```

Preparing (if there are any changes to db schema) and running migrations

```shell script
make makemigrations
make migrate
```

## How to Create an App

```shell
python3 manage.py startapp --template app-template <app-name>
```
