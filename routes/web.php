<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\ExtensionRequestController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\OrientationController;
use Illuminate\Support\Facades\Route;

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::post("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::middleware(["role:admin"])->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", [AdminController::class, "index"])->name("dashboard");

        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::patch("/companies/{company}/toggle-status", [CompanyController::class, "toggleStatus"])->name("companies.toggle-status");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        Route::get("/slides/library", [SlideController::class, "library"])->name("slides.library");
        Route::post("/slides", [SlideController::class, "store"])->name("slides.store");
        Route::patch("/slides/reorder-library", [SlideController::class, "reorderLibrary"])->name("slides.reorder-library");
        Route::delete("/slides/{slide}", [SlideController::class, "destroy"])->name("slides.destroy");

        Route::get("/slides/builder", [SlideController::class, "builder"])->name("slides.builder");
        Route::post("/slides/assign", [SlideController::class, "assignSlide"])->name("slides.assign");
        Route::post("/slides/unassign", [SlideController::class, "unassignSlide"])->name("slides.unassign");
        Route::patch("/slides/reorder-company", [SlideController::class, "reorderCompanySlides"])->name("slides.reorder-company");

        Route::get("/slides/preview", [SlideController::class, "preview"])->name("slides.preview");
        
        Route::get("/users/admins", [UserController::class, "admins"])->name("users.admins");
        Route::get("/users/employees", [UserController::class, "index"])->name("users.employees");

        Route::post("/users", [UserController::class, "store"])->name("users.store");
        Route::put("/users/{user}", [UserController::class, "update"])->name("users.update");
        Route::patch("/users/{user}/toggle-status", [UserController::class, "toggleStatus"])->name("users.toggle-status");
        Route::delete("/users/{user}", [UserController::class, "destroy"])->name("users.destroy");
        Route::post("/users/{user}/reset-password", [UserController::class, "resetPassword"])->name("users.reset-password");
        
        Route::get("/extension-requests", [ExtensionRequestController::class, "extensionRequests"])->name("extension-requests.index");
        Route::patch("/extension-requests/{extensionRequests}/approve", [ExtensionRequestController::class, "approveExtension"])->name("extension-requests.approve");
        Route::patch("/extension-requests/{extensionRequests}/deny", [ExtensionRequestController::class, "denyExtension"])->name("extension-requests.deny");
    });

    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", [OrientationController::class, "index"])->name("orientation");
        Route::post("/acknowledge", [OrientationController::class, "acknowledge"])->name("acknowledge");
        Route::get("/completed", [OrientationController::class, "completed"])->name("completed");
    });

    Route::middleware(['role:employee'])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/locked", [OrientationController::class, "locked"])->name("account-locked");
        Route::post("/extension-request", [OrientationController::class, "requestExtension"])->name("extension-request");
    });
});