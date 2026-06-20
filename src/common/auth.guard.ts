import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
  private JWKS = createRemoteJWKSet(
    new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) throw new UnauthorizedException('Missing authorization token');
    
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid header format');
    
    try {
      const { payload } = await jwtVerify(token, this.JWKS, {
        issuer: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
        audience: 'authenticated',
      });

      const metadata = payload.user_metadata as any;
      request.user = {
        id: payload.sub,
        email: payload.email,
        name: metadata?.full_name ?? metadata?.name ?? '',
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}