# User's guide

Find the basic concepts of the Checkpoint Checker at the [Wiki](https://github.com/DrMichaelPetter/qrchecklists/wiki/FA-Checkpoint-Checker).

## Basic Configuration

QR checklist App is best executed in (mobile) Chrome or Firefox. Make sure to call it via one of these two browsers to make sure, that you get decent access to your device's camera.

### Participant data
The most basic data that this app is based on is a CSV table with user data. In particular, we need a table with the following columns:
- First Name
- Last Name
- decoded QR code ID
- Hof
- Kursnummer
This table can be obtained from the fa-db portal and its Export: QR-Checklists-App item.

# Developer's guide to Checkpoint Checker

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deploying

Add an nginx config snippet:

```
       # QR Checkpoint checker for Ferienakademie:
        location /check {
                # Password protect app:
                auth_basic "FA Checkpoint App";
                auth_basic_user_file /srv/webserver/qrchecklists/htpasswd;

                # Serve the backend:
                location /check/backend {
                        auth_basic off;
                        proxy_pass http://127.0.0.1:5000/;
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-Forwarded-Proto $scheme;
                }
                # Serve the frontend:
                alias /srv/webserver/qrchecklists/webapp/;
                try_files $uri $uri/ /index.html;
        }
```

Build the app with package.json
```
    "homepage": "https://www2.in.tum.de/check"
```
and .env
```
REACT_APP_WEBSERVICE_URL=https://www2.in.tum.de/check/backend/
```
Add an /etc/systemd/system/qrcheck.service:
```
[Unit]
Description=Gunicorn instance to serve QR Checker Flask backend
After=network.target

[Service]
# Run the service under your system username
User=petter
Group=tumuser

# Path to your project's root directory
WorkingDirectory=/home/petter/qrchecklists/rest

# Path to the virtual environment's gunicorn binary and your app module
# If your main file is app.py and the flask instance is named app, use app:app
ExecStart=/home/petter/qrchecklists/rest/.venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 backend:app

# Automatically restart the service if it crashes
Restart=always

[Install]
WantedBy=multi-user.target
```
then run
```
sudo systemctl daemon-reload
sudo systemctl enable qrcheck
sudo systemctl start qrcheck

sudo journalctl -u qrcheck -f
```