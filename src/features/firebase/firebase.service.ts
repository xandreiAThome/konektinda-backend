import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      if (!admin.apps.length) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        console.log(
          `Firebase initialized for project: ${process.env.FIREBASE_PROJECT_ID}`,
        );
      }
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  }

  getAuth(): admin.auth.Auth {
    return admin.auth(this.firebaseApp);
  }
}
