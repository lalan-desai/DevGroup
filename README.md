# DevGroup

A student managing mobile applicaiton which can be usefull for your final year college project!

# Setup

The project contains both the frontend and backend files to run this project. Follow this guided steps that will help you securely run and build this project.

### Backend

 1. Extract the `Backend/api` files to your php server.
 2. Run the `Backend/sql/Database.sql` query in your server to generate the intial required database and tables.
 3. Put your SQL server information in the `Backend/api/Connection.php` file.
 4. Add Basic Auth Username & Password in the `Backend/api/Authentication.php` file.
 5. To secure our images folder from unauthorize access put your `.htpasswd` file in the `Backend/api/images/` folder.
>Tip: [HTPasswd Generator](https://www.web2generators.com/apache-tools/htpasswd-generator) will help that process.

### Frontend

1. Extract all `Frontend` files to your local folder.
2.  Generate a base64 of syntax `username:password` of your basic auth's username and password without the ending operators `==` and put that into the `.env` file. 
> For Example: 
Let's say your username is `admin` and your password is `1234`
	1.  Concatenate the username and password with a colon: `admin:1234`.
	2.  Encode the concatenated string using base64 encoding: `YWRtaW46MTIzNA==`.
	3.  Remove any trailing `==` signs from the base64 encoded string: `YWRtaW46MTIzNA`.
	4.  Add this value to your `.env` file:
	5. `.env` file will be `BASIC_AUTH=YWRtaW46MTIzNA`
	
 3. To now test it on an mobile device, download the Expo Go app from the [Playstore](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US&pli=1) or [Appstore](https://apps.apple.com/us/app/expo-go/id982107779).
4. Run command `npx expo start`
5. Scan the given QR code into the expo go mobile app. Initially you will have to enter your server URL for the API endpoint.