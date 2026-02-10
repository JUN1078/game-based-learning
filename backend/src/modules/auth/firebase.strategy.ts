import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  private defaultApp: admin.app.App;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    // Initialize Firebase Admin
    const projectId = configService.get('FIREBASE_PROJECT_ID');
    const clientEmail = configService.get('FIREBASE_CLIENT_EMAIL');
    const privateKey = configService.get('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) {
      return;
    }

    if (!admin.apps.length) {
      this.defaultApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      this.defaultApp = admin.app();
    }
  }

  async validate(token: string) {
    try {
      if (!this.defaultApp) {
        throw new UnauthorizedException('Firebase not configured');
      }
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await this.authService.validateUser(
        decodedToken.uid,
        decodedToken.email,
        decodedToken.name || decodedToken.email,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
