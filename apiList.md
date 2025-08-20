# DEV-TINDER API List

## authRouter

    POST /user/signup : user registered to the platform
        - with firstName, lastName, emailId & password (password hash will be stored: bcrypt)
    POST /user/login  : log-in using registered emailId&password
        - login password and stored passwordHash will be verified : bcrypt
        - create JWT token & set to cookies (response object)
    POST /user/logout : logs-out- remove JWT token
        - remove/clear the JWT token from cookies

## profileRouter

    GET /profile/view
        - to view the profile, user must be logged In
    PATCH /profile/edit
        - pass the required edit fields through req.body
        - check all the fields are allowed to update
        - read the user from req.user as it was attached in userAuth
        - update each fields and save the updated user details to DB
    PATCH /profile/password
        - accept current and new password
        - validate the current password using schema method for the loggedIn user (get it from req.user as it was authenticated by userAuth)
        - check if the new password is strong enough to use using validator library
        - encrypt the new password using bcrypt and update it for loggedInUser.password and save it.
        - TODO: handle forgot password API

## requestRouter

**_status_** : ignored/interested/accepted/rejected

    POST /request/send/interested/:userId
    POST /request/send/ignored/:userId
    POST /request/review/accepted/reqId
    POST /request/review/rejected/reqId

## userRouter

    GET /user/feed
    GET /user/connections
    GET /user/requests
