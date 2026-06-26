<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render("Auth/Login");
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            "email" => ["required", "email"],
            "password" => ["required"]
        ]);

        if (!Auth::attempt($credentials, $request->boolean("remember"))) {
            return back()->withErrors([
                "email" => "The provided credentials do not match our records"
            ]);
        }

        $request->session()->regenerate();

        return $this->redirectByRole(Auth::user()->role);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route("login");
    }

    private function redirectByRole(string $role): RedirectResponse
    {
        return match($role) {
            "admin" => redirect()->route("admin.dashboard"),
            "employee" => redirect()->route("employee.orientation"),
            default => redirect()->route("login")
        };
    }
}
