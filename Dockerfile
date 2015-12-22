FROM node:0.10

RUN  apt-get update
RUN apt-get install -y wget
RUN rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/local/share
WORKDIR /usr/local/share
RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2
RUN tar xjf phantomjs-1.9.7-linux-x86_64.tar.bz2
RUN ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
RUN ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
RUN ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g mean-cli bower gulp

RUN	groupadd -r node \
&&	useradd -r -m -g node node

COPY . /usr/src/app/
RUN rm -rf /usr/src/app/node_modules
RUN chown -R node:node /usr/src/app

USER node
RUN touch /home/node/.mean
WORKDIR /usr/src/app/packages/custom/dc-max
RUN npm install
WORKDIR /usr/src/app
RUN npm install
ENV PORT 3000
ENV DB_PORT_27017_TCP_ADDR db
CMD [ "npm", "start" ]
EXPOSE 3000


#How to build:
# git clone https://github.com/linnovate/mean
# cd mean
# docker build -t mean .

#How to run:
# docker pull mongo
# docker run -d --name db mongo
# docker run -p 3000:3000 --link db:db mean
