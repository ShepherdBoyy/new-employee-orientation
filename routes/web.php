<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\FolderController;
use App\Http\Controllers\Admin\FolderKeyTopicController;
use App\Http\Controllers\Admin\JobPositionController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\SlideController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\OrientationController;
use Illuminate\Support\Facades\Route;

Route::redirect("/", "/login");

Route::middleware("test")->group(function () {
    Route::get("/login", [AuthController::class, "showLogin"])->name("login");
    Route::post("/login", [AuthController::class, "login"])->name("login.attempt");
    Route::get("/logout", [AuthController::class, "logout"])->name("logout");
    
    Route::prefix("admin")->name("admin.")->group(function () {
        Route::get("/dashboard", [AdminController::class, "index"])->name("dashboard");

        // Notifications
        Route::get("/notifications", [NotificationController::class, "index"])->name("notifications.index");
        Route::post("/notifications/{id}/read", [NotificationController::class, "markAsRead"])->name("notifications.read");
        Route::post("/notifications/read-all", [NotificationController::class, "markAllAsRead"])->name("notifications.read-all");
        Route::delete("/notifications/{id}", [NotificationController::class, "clear"])->name("notifications.clear");
        Route::delete("/notifications", [NotificationController::class, "clearAll"])->name("notifications.clear-all");

        // Companies
        Route::get("/companies", [CompanyController::class, "index"])->name("companies.index");
        Route::post("/companies", [CompanyController::class, "store"])->name("companies.store");
        Route::put("/companies/{company}", [CompanyController::class, "update"])->name("companies.update");
        Route::delete("/companies/{company}", [CompanyController::class, "destroy"])->name("companies.destroy");

        // Jobs
        Route::get("/job-positions", [JobPositionController::class, "index"])->name("job-positions.index");
        Route::post('/job-positions', [JobPositionController::class, 'store'])->name('job-positions.store');
        Route::put('/job-positions/{jobPosition}', [JobPositionController::class, 'update'])->name('job-positions.update');
        Route::delete('/job-positions/{jobPosition}', [JobPositionController::class, 'destroy'])->name('job-positions.destroy');
        Route::delete('/destroy-multiple-jobs', [JobPositionController::class, 'destroyMultipleJobs']);

        // Jobs Assignment
        Route::get("/all-job-positions", [JobPositionController::class, "jobAssignments"])->name("all-jobs-positions.index");
        Route::post("/assign-jobs", [JobPositionController::class, 'assignJobs']);
        Route::delete("/delete-assigned-job/{comapny_id}/{job_id}", [JobPositionController::class, 'deleteAssignedJob']);
        Route::post('/upload-jd', [JobPositionController::class, 'uploadJd']);

        // Folders
        Route::post("/folders", [FolderController::class, "store"])->name("folders.store");
        Route::put("/folders/{folder}", [FolderController::class, "update"])->name("folders.update");
        Route::patch("/folders/reorder", [FolderController::class, "reorder"])->name("folders.reorder");
        Route::delete("/folders/{folder}", [FolderController::class, "destroy"])->name("folders.destroy");
        Route::put("/folders/{company}/job-specific", [FolderController::class, "updateJobSpecific"])->name("folders.job-specific.update");
        Route::get("/folders/{company:slug}", [FolderController::class, "companyIndex"])->name("folders.company");

        // Job Specific
        Route::get("/folders/{company:slug}/job-positions", [FolderController::class, "jobPositionPicker"])->name("folders.job-position-picker");
        Route::post("/folders/{company}/job-positions/{jobPosition}/resolve", [FolderController::class, "resolveJobSpecificFolder"])->name("folders.resolve-job-specific");
        
        // Topics
        Route::get("/folders/{company:slug}/{folder:slug}", [FolderKeyTopicController::class, "index"])->name("folders.topics.index");
        Route::post("/folders/{folder}/topics", [FolderKeyTopicController::class, "store"])->name('folders.topics.store');
        Route::put("/topics/{topic}", [FolderKeyTopicController::class, "update"])->name("topics.update");
        Route::patch("/folders/{folder}/topics/reorder", [FolderKeyTopicController::class, "reorder"])->name("folders.topics.reorder");
        Route::delete("/topics/{topic}", [FolderKeyTopicController::class, "destroy"])->name("topics.destroy");
        
        // Slides
        Route::get("/folders/{company:slug}/{folder:slug}/topics/{keyTopic:slug}", [SlideController::class, "index"])->name("folders.topics.slides.index");
        Route::post("/folders/{folder}/topics/{topic}/slides", [SlideController::class, "store"])->name("folders.topics.slides.store");
        Route::patch("/folders/{folder}/slides/reorder", [SlideController::class, "reorder"])->name("folder.slides.reorder");
        Route::delete("/folders/{folder}/slides/{slide}", [SlideController::class, "destroy"])->name("folder.slides.destroy");

        // Preview
        Route::get("/folders/preview-list", [FolderController::class, "previewFolderList"])->name("folders.preview-list");
        Route::get("/folders/{folder:slug}/preview", [SlideController::class, "previewFolder"])->name("folders.preview");

        // Users
        Route::get("/users/admins", [UserController::class, "admins"])->name("users.admins");
        Route::get("/users/employees", [UserController::class, "index"])->name("users.employees");
        Route::post("/users", [UserController::class, "store"])->name("users.store");
        Route::put("/users/{user}", [UserController::class, "update"])->name("users.update");
        Route::delete("/users/{user}", [UserController::class, "destroy"])->name("users.destroy");
        Route::get("/users/employees/{user}/progress", [UserController::class, "progress"])->name("users.employees.progress");
        Route::get("/users/employees/{user}/acknowledgement/pdf", [UserController::class, "exportAcknowledgementPdf"])->name("users.employees.acknowledgement-pdf");
    });

    Route::middleware(["expiry"])->prefix("orientation")->name("employee.")->group(function () {
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

Route::get('/preview-welcome-email', function () {
    return view('emails.employee-welcome', [
        'employeeName'  => 'Juan Dela Cruz',
        'companyName'   => 'Acme Corp',
        'jobPosition'   => 'Software Engineer',
        'email'         => 'juan@acme.com',
        'password'      => 'delacruz-neo@2026',
        'loginUrl'      => url('/login'),
        'expiresInDays' => 2,
    ]);
});

Route::get('/preview-completed-email', function () {
    return view('emails.orientation-completed', [
        'employeeName'   => 'Juan Dela Cruz',
        'employeeEmail'  => 'juan@acme.com',
        'companyName'    => 'Acme Corp',
        'jobPosition'    => 'Software Engineer',
        'acknowledgedAt' => now()->format('F j, Y g:i A'),
        'viewUrl'        => url('/admin/users/employees'),
    ]);
});