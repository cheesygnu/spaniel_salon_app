import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, PersistenceSettings, PersistentCacheSettings } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { provideHttpClient } from '@angular/common/http';

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
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => initializeFirestore(getApp(), {
      localCache: persistentLocalCache() }
    )),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideHttpClient()]

          //, provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"beercsshtml","appId":"1:43255017996:web:95c43518cb355aa8ff7429","databaseURL":"https://beercsshtml-default-rtdb.firebaseio.com","storageBucket":"beercsshtml.appspot.com","apiKey":"AIzaSyBRPEm8qWrxHDAq0yZ11NqcHmYjQ9S8jUQ","authDomain":"beercsshtml.firebaseapp.com","messagingSenderId":"43255017996"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
