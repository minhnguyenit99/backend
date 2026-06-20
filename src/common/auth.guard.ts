import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
  private JWKS = createRemoteJWKSet(
    new URL(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
    ),
  );
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing token');
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid header');
    }
    try {
      const { payload } = await jwtVerify(token, this.JWKS, {
        issuer: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
        audience: 'authenticated',
      });

      request.user = {
        id: payload.sub,
        email: payload.email,
        name:
          (payload.user_metadata as any)?.full_name ??
          (payload.user_metadata as any)?.name ??
          '',
      };
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

//   const userPayload = payload as unknown as SupabaseJwtPayload;
//   const user = await this.prisma.user.upsert({
//   where: { id: userPayload.sub }, // 2. Search by the unique Supabase ID
//   update: {
//     name: userPayload.user_metadata?.full_name ?? userPayload.user_metadata?.name ?? '',
//     email: userPayload.email     // Update email in case they changed it on Google
//   },
//   create: {
//     id: userPayload.sub,          // 3. Save the Supabase ID into your database
//     name: userPayload.user_metadata?.full_name ?? userPayload.user_metadata?.name ?? '',
//     email: userPayload.email
//   },
// });
