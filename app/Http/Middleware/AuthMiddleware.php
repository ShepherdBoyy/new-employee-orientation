<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. If not logged in and trying to access a page other than 'login'
        if (!Auth::check() && $request->path() != 'login') {
            return redirect('login')->withErrors(['error' => 'User must be logged in.']);
        }

        // 2. If logged in and trying to access the 'login' page
        if (Auth::check() && $request->path() == 'login') {
            if (Auth::user()->role == 'admin') {
                return redirect('admin/dashboard');
            } else if (Auth::user()->role == 'employee') {
                return redirect('orientation');
            } else {
                return redirect('logout');
            }
        }

        // 3. Prevent cross-role access (Employee accessing Admin routes, and vice versa)
        if (Auth::check()) {
            $isAdminRoute = str_starts_with($request->path(), 'admin');
            $userRole = Auth::user()->role;
            // If an employee tries to access an admin route
            if ($userRole == 'employee' && $isAdminRoute) {
                return redirect('orientation')->withErrors(['error' => 'Unauthorized access.']);
            }

            // If an admin tries to access employee-specific routes (optional, if you want strict separation)
            // Adjust 'orientation' or other paths as needed for your admin restriction rules
            if ($userRole == 'admin' && $request->path() == 'orientation') {
                return redirect('admin/dashboard');
            }
        }

        $response = $next($request);

        return $response->header('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
                        ->header('Pragma', 'no-cache')
                        ->header('Expires', 'Sat, 01 Jan 1990 00:00:00 GMT');
    }
}
