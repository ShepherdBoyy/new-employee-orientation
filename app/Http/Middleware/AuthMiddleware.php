<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{

    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() && $request->path() != 'login') {
            return redirect('login')->withErrors(['error' => 'User must be logged in.']);
        }

        if (Auth::check() && $request->path() == 'login') {
            if (Auth::user()->role == 'admin') {
                return redirect('admin/companies');
            } else if (Auth::user()->role == 'employee') {
                return redirect('orientation');
            } else {
                return redirect('logout');
            }
        }

        if (Auth::check()) {
            $isAdminRoute = str_starts_with($request->path(), 'admin');
            $userRole = Auth::user()->role;
            if ($userRole == 'employee' && $isAdminRoute) {
                return redirect('orientation')->withErrors(['error' => 'Unauthorized access.']);
            }

            if ($userRole == 'admin' && $request->path() == 'orientation') {
                return redirect('admin/dashboard');
            }
        }

        $response = $next($request);

        $response->headers->set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', 'Sat, 01 Jan 1990 00:00:00 GMT');

        return $response;
    }
}
