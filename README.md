# nurxpress-expoRN
1. Install expo cli on your machine using the following commands:
    npm install -g expo-cli	
    For more details, go to the documentation -> Expo Cli QuickStart:
    https://reactnative.dev/docs/environment-setup
  
2. Clone the repository:
    git clone https://github.com/zeinab-zeitoun/nurxpress-expoRN.git

3. In the command line, run:

    cd <project-name>
    npm install
    
4. Firebase:

    a. It is assumed that you already created a Firebase project and enabled authentication with email and password (refer to README file in nurxpress_laravel https://github.com/zeinab-zeitoun/nurxpress_laravel.git)
    
    b. Get the Firebase config:
          From Firebase navigate to Project settings -> General -> Your apps -> Copy the following and paste them in FirebaseConfig.js in the project:
          var firebaseConfig = {
            apiKey: "API_KEY",
            authDomain: "PROJECT_ID.firebaseapp.com",
            databaseURL: "https://PROJECT_ID.firebaseio.com",
            projectId: "PROJECT_ID",
            storageBucket: "PROJECT_ID.appspot.com",
            messagingSenderId: "SENDER_ID",
            appId: "APP_ID",
            measurementId: "G-MEASUREMENT_ID",
          };
          
    c. Go to Firebase->storage-> create a folder “avatar”. In the folder avatar, upload an image and name it: default-avatar.jpg
        You can use my default avatar image below or any other image
        https://firebasestorage.googleapis.com/v0/b/nurxpress-chats.appspot.com/o/avatar%2Fdefault-avatar.jpg?alt=media&token=bba3e80c-4f6b-49a3-8ab1-8816c48cdfcd 
        
    d. Firebase Rules: 
    
          Go to cloud firestore-> rules, then copy and paste the following:
              rules_version = '2';
              service cloud.firestore {
                match /databases/{database}/documents {
                  match /{document=**} {
                    allow read, write, create: if
                        request.auth != null;
                  }
                }
              }
              
           Go to Storage -> rules, the copy and paste the following:
              rules_version = '2';
              service firebase.storage {
                match /b/{bucket}/o {
                  match /{allPaths=**} {
                    allow read, write: if request.auth != null;
                  }
                }
              }

5. To run the application, run the following command:
      expo start
    You can use Android Emulator or IOS Simulator.
    It is recommended to run the application on your physical device to get notifications, to do so:
      Go get the Expo app on your Android or iOS device. It's available on the Google Play Store and on the iOS App Store.
      Scan the QR Code
