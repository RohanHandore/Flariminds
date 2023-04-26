# LifeActions Parsing

To parse the application data

## Development

### Setup
- Nodejs
- VS Code
- MySQL Server and Workbench
- Ngrok

### Run the code in development environment
1. Clone the **develop** branch
```
git clone -b develop https://github.com/punit-suman/lifeactions-parse.git
```
2. Run ```npm install``` to install all dependencies
3. Check if working with local database config or remote database config in **dbConfigMySQL.js** file and set **production** value accordingly
4. Create database (if not already exists) and initialize tables with seed data by running queries from **queries.sql** and **seed.sql**
5. Create tables to capture files and parsed data
   - file_{date}
   - data_transaction_{date}
   - event_data_{date}
6. Run the local server in development mode using
```
npm run start-dev
```

### Integrate local server with the mobile application to capture data
1. Open ngrok cmd and run to channelize the local server through remote link
```
ngrok http 8080
```
2. Install mobile application and enter the link in the **'About'** input box
3. Click on **Perm** button to allow **Usage Stats** and **Storage** permissions
4. Click on **Submit** button to submit and create user and allow **Accessibility Service** permission to start capturing data
5. Connect phone to internet and to charging for transferring the data to the server