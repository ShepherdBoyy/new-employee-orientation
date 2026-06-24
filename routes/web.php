<?php

use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::middleware(["role:admin"])->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", fn() => inertia("Admin/Dashboard"))->name("dashboard");

        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::patch("/companies/{company}/toggle-status", [CompanyController::class, "toggleStatus"])->name("companies.toggle-status");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        Route::get("/slides/preview", [EmployeeController::class, "preview"])->name("slides.preview");
        Route::get("/slides", [SlideController::class, "index"])->name("slides.index");
        Route::post("/slides", [SlideController::class, "store"])->name("slides.store");
        Route::patch("/slides/reorder", [SlideController::class, "reorder"])->name("slides.reorder");
        Route::delete("/slides/{slide}", [SlideController::class, "destroy"])->name("slides.destroy");
        
        Route::get("/users/admins", [EmployeeController::class, "admins"])->name("users.admins");
        Route::get("/users/employees", [EmployeeController::class, "index"])->name("users.employees");

        Route::post("/users", [EmployeeController::class, "store"])->name("users.store");
        Route::put("/users/{user}", [EmployeeController::class, "update"])->name("users.update");
        Route::patch("/users/{user}/toggle-status", [EmployeeController::class, "toggleStatus"])->name("users.toggle-status");
        Route::delete("/users/{user}", [EmployeeController::class, "destroy"])->name("users.destroy");
        Route::post("/users/{user}/reset-password", [EmployeeController::class, "resetPassword"])->name("users.reset-password");
        
        Route::get("/extension-requests", [EmployeeController::class, "extensionRequests"])->name("extension-requests.index");
        Route::patch("/extension-requests/{extensionRequests}/approve", [EmployeeController::class, "approveExtension"])->name("extension-requests.approve");
        Route::patch("/extension-requests/{extensionRequests}/deny", [EmployeeController::class, "denyExtension"])->name("extension-requests.deny");
    });

    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", fn() => inertia("Employee/Orientation"))->name("orientation");
        Route::get("/locked", fn() => inertia("Employee/AccountLocked"))->name("account-locked");
    });
});