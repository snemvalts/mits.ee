# mits.ee
Welcome to MITS website

[Read our wiki](https://github.com/snemvalts/mits.ee/wiki/Home)

## How to run application

1. Make sure you have Node, npm and Docker installed. If you're on Windows, it's very much recommended to use WSL
2. Clone or download the project
3. Open terminal and navigate to mits.ee/website folder
4. Run the following commands<br>
`npm install`<br>
`npm run build`
5. Create folder `mongo-data`
6. Create new `.env` file based on `sample.env`. Change `DB_DATA_PATH` to absolute path to `mongo-data` folder
7. While in /website folder, to start development server run<br>
`start-dev-server`<br>
script. If you are on Windows and are not using WSL, you can run the commands in the script manually.
8. To open website, go to localhost:8080

## How to use CMS

1. Make sure the server is running
2. Go to localhost:8080/admin/cms
3. There you can edit website fields using basic HTML and CSS
