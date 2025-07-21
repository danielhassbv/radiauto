import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideHttpClient, withInterceptors } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnalytics(() => getAnalytics()),
    provideFirestore(() => getFirestore()),

    provideStorage(() => getStorage()),
    provideHttpClient(
      withInterceptors([])
    )

  ]
};
