<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\FolderController;
use App\Http\Controllers\Admin\JobPositionController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\OrientationController;
use Illuminate\Support\Facades\Route;

Route::redirect("/", "/login");

Route::middleware("guest")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
});

Route::middleware("auth")->group(function () {
    Route::get("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::middleware("role:admin")->prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", [AdminController::class, "index"])->name("dashboard");

        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        Route::get("/job-positions", [JobPositionController::class, "index"])->name("job-positions.index");
        Route::post('/job-positions', [JobPositionController::class, 'store'])->name('job-positions.store');
        Route::put('/job-positions/{jobPosition}', [JobPositionController::class, 'update'])->name('job-positions.update');
        Route::delete('/job-positions/{jobPosition}', [JobPositionController::class, 'destroy'])->name('job-positions.destroy');
        Route::delete('/destroy-multiple-jobs', [JobPositionController::class, 'destroyMultipleJobs']);

        Route::get("/all-job-positions", [JobPositionController::class, "jobAssignments"])->name("all-jobs-positions.index");
        Route::post("/assign-jobs", [JobPositionController::class, 'assignJobs']);
        Route::delete("/delete-assigned-job/{comapny_id}/{job_id}", [JobPositionController::class, 'deleteAssignedJob']);
        Route::post('/upload-jd', [JobPositionController::class, 'uploadJd']);
        
        Route::get("/folders/preview-list", [FolderController::class, "previewFolderList"])->name("folders.preview-list");
        Route::get("/folders/{company:slug}", [FolderController::class, "companyIndex"])->name("folders.company");
        Route::get("/folders/{company:slug}/job-positions", [FolderController::class, "jobPositionPicker"])->name("folders.job-position-picker");
        Route::post("/folders/{company}/job-positions/{jobPosition}/resolve", [FolderController::class, "resolveJobSpecificFolder"])->name("folders.resolve-job-specific");
        
        Route::post("/folders", [FolderController::class, "store"])->name("folders.store");
        Route::put("/folders/{folder}", [FolderController::class, "update"])->name("folders.update");
        Route::put("/folders/{company}/job-specific-name", [FolderController::class, "updateJobSpecificName"])->name("folders.job-specific.update-name");
        Route::patch("/folders/reorder", [FolderController::class, "reorder"])->name("folders.reorder");
        Route::delete("/folders/{folder}", [FolderController::class, "destroy"])->name("folders.destroy");

        Route::get("/folders/{folder:slug}/preview", [SlideController::class, "previewFolder"])->name("slides.preview");
        Route::get("/folders/{folder:slug}/slides", [SlideController::class, "index"])->name("slides.index");
        Route::post("/folders/{folder}/slides", [SlideController::class, "store"])->name("slides.store");
        Route::patch("/folders/{folder}/slides/reorder", [SlideController::class, "reorder"])->name("slides.reorder");
        Route::delete("/folders/{folder}/slides/{slide}", [SlideController::class, "destroy"])->name("slides.destroy");

        Route::get("/users/admins", [UserController::class, "admins"])->name("users.admins");
        Route::get("/users/employees", [UserController::class, "index"])->name("users.employees");
        Route::post("/users", [UserController::class, "store"])->name("users.store");
        Route::put("/users/{user}", [UserController::class, "update"])->name("users.update");
        Route::delete("/users/{user}", [UserController::class, "destroy"])->name("users.destroy");
        Route::get("/users/employees/{user}/progress", [UserController::class, "progress"])->name("users.employees.progress");
        Route::get("/users/employees/{user}/signature", [UserController::class, "viewSignature"])->name("users.employees.signature");
        Route::get("/users/employees/{user}/photo", [UserController::class, "viewPhoto"])->name("users.employees.photo");
        Route::get("/users/employees/{user}/acknowledgement/signature-file", [UserController::class, "streamSignature"])
            ->name("users.employees.signature-file")
            ->middleware("signed");
        Route::get("/users/employees/{user}/acknowledgement/photo-file", [UserController::class, "streamPhoto"])
            ->name("users.employees.photo-file")
            ->middleware("signed");
    });

    Route::middleware(["role:employee", "expiry"])->prefix("orientation")->name("employee.")->group(function () {
        Route::get("/", [OrientationController::class, "welcome"])->name("welcome");
        Route::get("/folders", [OrientationController::class, "index"])->name("folders.index");
        Route::get("/folders/{folder:slug}", [OrientationController::class, "showFolder"])->name("folders.show");
        Route::post("/folders/{folder}/complete", [OrientationController::class, "completeFolder"])->name("folders.complete");
        Route::get("/acknowledgement", [OrientationController::class, "acknowledgement"])->name("acknowledgement");
        Route::post("/acknowledgement", [OrientationController::class, "submitAcknowledgement"])->name("acknowledgement.submit");
        Route::get("/completed", [OrientationController::class, "completed"])->name("completed");
        Route::get("/locked", [OrientationController::class, "locked"])->name("account-locked");
    });
});