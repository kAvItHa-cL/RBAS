import { AuthService } from 'src/app/auth/auth.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: import('@angular/router').ActivatedRouteSnapshot, Fstate: import('@angular/router').RouterStateSnapshot): boolean |
    import('@angular/router').UrlTree |
    import('rxjs').Observable<boolean |
    import('@angular/router').UrlTree> | Promise<boolean |
      import('@angular/router').UrlTree> {
    const isAuth = this.authService.getAuthStatus();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    const roles = route.data.roles as Array<string>;
    //console.log('Roles in AuthGaurd', roles);
    if (roles) {
      const match = this.authService.rolesMatch(roles);
      if (match) { return true; } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    return isAuth;
  }
}
