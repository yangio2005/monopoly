import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database'; // Import for Realtime Database

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Home } from './home/home';

// TODO: Replace with your actual Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUGeZCAgXv9agDvbXAmkNnRBaFurhbeOE",
  authDomain: "cotyphu2a.firebaseapp.com",
  projectId: "cotyphu2a",
  storageBucket: "cotyphu2a.firebasestorage.app",
  messagingSenderId: "450091737019",
  appId: "1:450091737019:web:5cc2d8fc4a8cfe355bee9e",
  measurementId: "G-5L07HP1NLJ"
};

@NgModule({
  declarations: [
    App,
    Login,
    Home
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Add FormsModule here
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()) // Add Realtime Database provider
  ],
  bootstrap: [App]
})
export class AppModule { }
