<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    protected $levels = [
        //
    ];

    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // Catch 404 Not Found errors
        if ($exception instanceof NotFoundHttpException) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/NotFound')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            return Inertia::render('Errors/NotFound')
                ->toResponse($request)
                ->setStatusCode(404);

        }

        return parent::render($request, $exception);
    }

}
