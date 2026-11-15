# Tomato Hours

https://tomato-hours.joglr.dev/

A pomodoro timer for tracking work hours and earnings.

## Google Calendar planning

The Week view uses Google Calendar as its source of truth. Create an OAuth
client ID for a web application, add the app's local and production origins to
the authorized JavaScript origins, and set:

```sh
REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Setup:

1. Enable the Google Calendar API in a Google Cloud project.
2. Configure the OAuth consent screen for the account(s) that will use the app.
3. Create a Web application OAuth client ID.
4. Add `http://localhost:3000` and `https://tomato-hours.joglr.dev` to its
   authorized JavaScript origins.
5. Copy `.env.example` to `.env.local` and set the client ID.

The app requests Google Calendar event access only when the user chooses
“Connect Google Calendar”. Without this variable, the Week view shows a
configuration error instead of pretending that sync is available.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
