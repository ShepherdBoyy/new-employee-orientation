<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");

    Route::middleware("role:super_admin")->prefix("super-admin")->name("super-admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("SuperAdmin/Dashboard"))->name("dashboard");
    });
    Route::middleware(["role:company_admin"])->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("Admin/Dashboard"))->name("dashboard");
    });
    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", fn() => inertia("Employee/Orientation"))->name("orientation");
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});