<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SuperAdmin\CompanyAdminController;
use App\Http\Controllers\SuperAdmin\CompanyController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");

    Route::middleware("role:super_admin")->prefix("super-admin")->name("super-admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("SuperAdmin/Dashboard"))->name("dashboard");

        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::patch("/companies/{company}/toggle-status", [CompanyController::class, "toggleStatus"])->name("companies.toggle-status");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        Route::get("/company-admins", [CompanyAdminController::class, "index"])->name("company-admins.index");
        Route::post("/company-admins", [CompanyAdminController::class, "store"])->name("company-admins.store");
        Route::put("/company-admins/{user}", [CompanyAdminController::class, "update"])->name("company-admins.update");
        Route::patch("/company-admins/{user}/toggle-status", [CompanyAdminController::class, "toggleStatus"])->name("company-admins.toggle-status");
        Route::delete("/company-admins/{user}", [CompanyAdminController::class, "destroy"])->name("company-admins.destroy");
        Route::post("/company-admins/{user}/reset-password", [CompanyAdminController::class, "resetPassword"])->name("company-admins.reset-password");
    });
    Route::middleware(["role:company_admin"])->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("Admin/Dashboard"))->name("dashboard");
    });
    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", fn() => inertia("Employee/Orientation"))->name("orientation");
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});