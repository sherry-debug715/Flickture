# Start with Node.js to build React app
FROM node:14 AS build-stage

WORKDIR /react-app

COPY ./react-app/package*.json ./

RUN npm install

COPY ./react-app/ ./

RUN npm run build

# set up python environment
FROM python:3.9
# Set the following enviroment variables
#
ENV REACT_APP_BASE_URL=https://flickture-c151b11b3eef.herokuapp.com/
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True


# Set the directory for upcoming commands to /var/www
WORKDIR /var/www

# Copy all the files from your repo to the working directory
COPY . .

# Copy the built react app (it's built for us) from the  
# /react-app/build/ directory into your flasks app/static directory
COPY --from=build-stage /react-app/build/* app/static/

# Run the next two python install commands with PIP
# install -r requirements.txt
# install psycopg2
RUN pip install -r requirements.txt

RUN pip install psycopg2

# Start the flask environment by setting our
# closing command to gunicorn app:app
CMD gunicorn app:app

