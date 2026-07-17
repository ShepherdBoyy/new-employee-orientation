<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountExpiry
{
    public function handle(Request $request, Closure $next): Response
    {   
        $user = $request->user();

        if (!$user) {
            return redirect()->route("login");
        }

        if ($user->isEmployee() && $user->isExpired()) {
            return redirect()->route("employee.account-locked");
        }

        return $next($request);
    }
}
