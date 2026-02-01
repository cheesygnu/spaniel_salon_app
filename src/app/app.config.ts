import { ApplicationConfig, provideZoneChangeDetection, isDevMode, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

// Create injection tokens for Firebase services
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>('FIREBASE_FIRESTORE');
export const FIREBASE_STORAGE = new InjectionToken<ReturnType<typeof getStorage>>('FIREBASE_STORAGE');

// Initialize Firebase app
const app = initializeApp(environment.firebase);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
const storage = getStorage(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    // Provide Firebase instances using injection tokens
    { provide: FIREBASE_APP, useValue: app },
    { provide: FIREBASE_AUTH, useValue: auth },
    { provide: FIREBASE_FIRESTORE, useValue: firestore },
    { provide: FIREBASE_STORAGE, useValue: storage },
    provideHttpClient()
  ]

          //, provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","databaseURL":"https://beercsshtml-default-rtdb.firebaseio.com","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
