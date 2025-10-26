<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AllPatientController;
use App\Http\Controllers\PatientVisitController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\MedicationTemplateController;
use App\Http\Controllers\ServiceChargesController;
use App\Http\Controllers\MedicationListController;
use App\Http\Controllers\FrequencyListController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\LaboratoryTestController;
use App\Http\Controllers\AppointmentManagerController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UnfinishedDocsController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicalCertificateController;
use App\Http\Controllers\VitalSignsModalController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\PatientLaboratoryTestController;
use App\Http\Controllers\LaboratoryRequestController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserAccountController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'show'])->name('dashboard');
    Route::get('/upcomingpatients/dashboard', [DashboardController::class, 'getUpcomingPatients'])->name('upcoming_patients');
    Route::get('/billing-patients/dashboard', [DashboardController::class, 'getBillingItems'])->name('billing_patients');
    Route::get('/pending-patients/dashboard', [DashboardController::class, 'getPendingProcedures'])->name('pending_patients');
    Route::get('/today-activities/dashboard', [DashboardController::class, 'getTodayActivities'])->name('today_activites');
    Route::get('/summary/dashboard', [DashboardController::class, 'getSummary'])->name('DashboardSummary');
    Route::get('/', [DashboardController::class, 'show'])->name('home');
    Route::get('/queue-user', [DashboardController::class, 'get_queue_user'])->name('queue.user');


    Route::get('/appointment-manager', [AppointmentManagerController::class, 'index'])->name('appointments.index');

    // });

    // All Patients Routes
    Route::get('/allpatients', [AllPatientController::class, 'index'])->name('allpatients');
    Route::post('/allpatients/add/register', [AllPatientController::class, 'patientadd'])->name('patients.register');
    Route::get('/patients/add', [AllPatientController::class, 'patientaddform'])->name('allpatients.create');
    Route::get('/allpatients/serial_id', [AllPatientController::class, 'latest_id'])->name('allpatients.latestpatient_id');
    Route::get('/patient/edit/{id}', [AllPatientController::class, 'edit'])->name('patient.edit');
    Route::put('/patient/update/{id}', [AllPatientController::class, 'update'])->name('patient.update');
    // Route::get('/doctor/create', [UserAccountController::class, 'doctorCreate'])->name('doctor.create');



    Route::post('/billing-records', [BillingController::class, 'store'])->name('billingrecord.add');
    Route::get('/billing-records', [BillingController::class, 'index'])->name('billingrecord');
    Route::get('/vitalsignsmodal/{id}', [VitalSignsModalController::class, 'index'])->name('vitalsignsmodal');
    Route::put('/vitalsignsmodal/update/{id}', [VitalSignsModalController::class, 'updatePatientVitals'])->name('vitalsignsmodal.update');
    Route::post('/vitalsignsmodal/add', [VitalSignsModalController::class, 'AddPatientVitals'])->name('vitalsignsmodal.add');


    // Route::middleware(['auth', 'verified', 'role:admin,doctor'])->group(function () {





    Route::get('/medical-records/patientvisitform/{patient_id}/{appointment_id}', [PatientVisitController::class, 'index'])->name('patientvisitform.index');
    Route::get('/patientvisitform/{patient_id}/{appointment_id}', [PatientVisitController::class, 'check_status'])->name('patientvisitform.status');
    Route::put('/patientvisitform/{patient_id}/{appointment_id}', [PatientVisitController::class, 'update_status'])->name('patientvisitform.updatestatus');
    Route::get('/medicalhistory/{patient_id}', [PatientVisitController::class, 'get_medical_history'])->name('patientvisitform.get_medical_history');
    Route::post('/medicalhistory/add', [PatientVisitController::class, 'add_medical_history'])->name('patientvisitform.add_medical_history');


    Route::post('/patient/prescription/add', [PatientVisitController::class, 'patientprescription_add'])->name('patientvisitform.patientprescriptionadd');
    Route::put('/patient/prescription/update/{id}', [PatientVisitController::class, 'patientprescription_update'])->name('patientvisitform.patientprescriptionupdate');
    Route::get('/patient/prescription/get/{id}/{app_id}', [PatientVisitController::class, 'patientprescription_get'])->name('patientvisitform.patientprescriptionget');
    Route::delete('/patient/prescription/delete/{id}', [PatientVisitController::class, 'patientprescription_remove'])->name('patientvisitform.patientprescriptionremove');


    Route::post('/patient/chiefcomplaint/add', [PatientVisitController::class, 'add_patient_chief_complaint'])->name('patientvisitform.patientEntryAdd.chief_complaint');
    Route::put('/patient/chiefcomplaint/udpate', [PatientVisitController::class, 'update_patient_chief_complaint'])->name('patientvisitform.patientEntryUpdate.chief_complaint');
    Route::get('/patient/chiefcomplaint/get/{id}/{app_id}', [PatientVisitController::class, 'get_patient_chief_complaint'])->name('patientvisitform.patientchiefcomplaintget');
    Route::delete('/patient/chiefcomplaint/delete', [PatientVisitController::class, 'delete_patient_chief_complaint'])->name('patientvisitform.patientchiefcomplaintdelete');

    Route::post('/patient/physicalexam/add', [PatientVisitController::class, 'add_patient_physical_exam'])->name('patientvisitform.patientEntryAdd.physical_exam');
    Route::put('/patient/physicalexam/udpate', [PatientVisitController::class, 'update_patient_physical_exam'])->name('patientvisitform.patientEntryUpdate.physical_exam');
    Route::get('/patient/physicalexam/get/{id}/{app_id}', [PatientVisitController::class, 'get_patient_physical_exam'])->name('patientvisitform.patientphysicalexamget');
    Route::delete('/patient/physicalexam/delete', [PatientVisitController::class, 'delete_patient_physical_exam'])->name('patientvisitform.patientphysicalexamdelete');

    Route::post('/patient/plan/add', [PatientVisitController::class, 'add_patient_plans'])->name('patientvisitform.patientEntryAdd.plan');
    Route::put('/patient/plan/udpate', [PatientVisitController::class, 'update_patient_plan'])->name('patientvisitform.patientEntryUpdate.plan');

    Route::post('/patient/diagnosis/add', [PatientVisitController::class, 'add_patient_diagnosis'])->name('patientvisitform.patientEntryAdd.diagnosis');
    Route::put('/patient/diagnosis/udpate', [PatientVisitController::class, 'update_patient_diagnosis'])->name('patientvisitform.patientEntryUpdate.diagnosis');
    Route::get('/patientdiagnosis/{id}/{app_id}', [PatientVisitController::class, 'get_patient_diagnosis'])->name('patientvisitform.patientdiagnosisget');
    Route::delete('/patientdiagnosis', [PatientVisitController::class, 'delete_patient_diagnosis'])->name('patientvisitform.patientdiagnosisdelete');

    Route::post('/patient/notes/add', [PatientVisitController::class, 'add_patient_notes'])->name('patientvisitform.patientnotesadd');
    Route::get('/patient/notes/get/{id}/{app_id}', [PatientVisitController::class, 'get_patient_notes'])->name('patientvisitform.patientnotesget');
    Route::delete('/patient/notes/delete', [PatientVisitController::class, 'delete_patient_notes'])->name('patientvisitform.patientnotesdelete');



    Route::get('/user-accounts', [UserAccountController::class, 'show'])->name('users.index');
    Route::get('/user/create', [UserAccountController::class, 'create'])->name('user.create');
    Route::get('/user/{id}/edit', [UserAccountController::class, 'edit'])->name('user.edit');
    Route::post('/user', [UserAccountController::class, 'store'])->name('users.store');
    Route::put('/user/{id}', [UserAccountController::class, 'update'])->name('users.update');
    Route::delete('/user/{id}', [UserAccountController::class, 'destroy'])->name('users.destroy');



    Route::get('/service-charges', [ServiceChargesController::class, 'index'])->name('service-charges');
    Route::post('/service-charges', [ServiceChargesController::class, 'store'])->name('service-charges.store');
    Route::put('/service-charges/{id}', [ServiceChargesController::class, 'update'])->name('service-charges.update');
    Route::delete('/service-charges/{id}', [ServiceChargesController::class, 'destroy'])->name('service-charges.destroy');

    Route::get('/medication-list', [MedicationListController::class, 'index'])->name('medication-list');
    Route::get('/medication-getlist', [MedicationListController::class, 'getlist'])->name('medication-list-get');
    Route::post('/medication-list', [MedicationListController::class, 'store'])->name('medication-list.store');
    Route::put('/medication-list/{id}', [MedicationListController::class, 'update'])->name('medication-list.update');
    Route::delete('/medication-list/{id}', [MedicationListController::class, 'destroy'])->name('medication-list.destroy');

    // Route::get('/laboratory-test-list', function () {
    //     return Inertia::render('LaboratoryTestList');
    // })->name('laboratory-test-list');

    Route::get('/medication-templates', [MedicationTemplateController::class, 'index'])->name('medication-templates');
    Route::post('/medication-templates', [MedicationTemplateController::class, 'store'])->name('medication-templates.store');
    Route::put('/medication-templates/{id}', [MedicationTemplateController::class, 'update'])->name('medication-templates.update');
    Route::delete('/medication-templates/{id}', [MedicationTemplateController::class, 'destroy'])->name('medication-templates.destroy');
    Route::get('/medication-templates/{id}/medications', [MedicationTemplateController::class, 'getMedicationsList'])->name('medication-templates.medications');
    Route::get('/medication-sub-templates/{id}', [MedicationTemplateController::class, 'get_medication_templates'])->name('medication-templates.submedications');
    Route::get('/medication-templates/medications', [MedicationTemplateController::class, 'getMedicationsTemp_List'])->name('medication-templates.list');
    Route::delete('/medication-templates/{template}/medications/{medication}', [MedicationTemplateController::class, 'deleteListMedication'])->name('medication-templates.medications.destroy');
    Route::post('/medication-templates/{templateId}/medications', [MedicationTemplateController::class, 'saveMedication'])->name('medication-templates.medications.store');
    Route::put('/medication-templates/{templateId}/medications/{medicationId}', [MedicationTemplateController::class, 'updateMedication'])->name('medication-templates.medications.update');



    // Frequency List Routes
    Route::get('/frequency-list', [FrequencyListController::class, 'index'])->name('frequency-list');
    Route::get('/frequency-getlist', [FrequencyListController::class, 'getlist'])->name('frequency-getlist');
    Route::post('/frequency-list', [FrequencyListController::class, 'store'])->name('frequency-list.store');
    Route::put('/frequency-list/{id}', [FrequencyListController::class, 'update'])->name('frequency-list.update');
    Route::delete('/frequency-list/{id}', [FrequencyListController::class, 'destroy'])->name('frequency-list.destroy');

    // Plan List Routes
    Route::get('/plan-list', [PlanController::class, 'index'])->name('plan-list');
    Route::get('/planlist', [PlanController::class, 'planlist'])->name('planlist');
    Route::post('/plan-list', [PlanController::class, 'store'])->name('plan-list.store');
    Route::put('/plan-list/{id}', [PlanController::class, 'update'])->name('plan-list.update');
    Route::delete('/plan-list/{id}', [PlanController::class, 'destroy'])->name('plan-list.destroy');
    // Route::resource('plans', PlanController::class);


    Route::post('/patient/planlist', [PatientVisitController::class, 'add_patient_plans'])->name('addpatientplanlist');
    Route::get('/patient/planlist/{id}/{app_id}', [PatientVisitController::class, 'get_patient_plans'])->name('getpatientplanlist');
    Route::delete('/planlists', [PatientVisitController::class, 'delete_patient_plans'])->name('deletepatientplanlists');


    Route::get('/laboratory-test', [LaboratoryTestController::class, 'index'])->name('laboratory-test');
    Route::post('/laboratory-test', [LaboratoryTestController::class, 'store'])->name('laboratory-test.store');
    Route::put('/laboratory-test/{test}', [LaboratoryTestController::class, 'update'])->name('laboratory-test.update');
    Route::delete('/laboratory-test/{test}', [LaboratoryTestController::class, 'destroy'])->name('laboratory-test.destroy');


    // Appointment routes
    Route::post('/appointments/reorder', [AppointmentManagerController::class, 'reorder'])->name('appointments.reorder');
    Route::get('/appointments', [AppointmentManagerController::class, 'index'])->name('appointments.index');
    Route::get('/appointments/select-patient', [AppointmentManagerController::class, 'selectPatient'])->name('appointments.select_patient');
    Route::get('/appointments/create', [AppointmentManagerController::class, 'createAppointment'])->name('appointments.create');
    Route::post('/appointments/create-new', [AppointmentManagerController::class, 'createNewAppointment'])->name('appointments.create_new');
    Route::get('/queue-numbers/{age}', [AppointmentManagerController::class, 'getQueueNumbers'])->name('api.queue-numbers');
    Route::get('/closed-appointments', [AppointmentManagerController::class, 'closedAppointments'])->name('appointments.closed');
    Route::delete('/closed/appointments/{id}', [AppointmentManagerController::class, 'closedDelete'])->name('appointments.destroy.closed');
    Route::delete('/active/appointments/{id}', [AppointmentManagerController::class, 'activeDelete'])->name('appointments.destroy.active');
    Route::put('/appointments/update-status/{id}', [AppointmentManagerController::class, 'updateStatus'])->name('appointments.update-status');
    Route::put('/appointments/close-form/{id}', [AppointmentManagerController::class, 'closeForm'])->name('appointments.close-form');
    Route::post('/appointments/check-out/{id}', [AppointmentManagerController::class, 'checkOut'])->name('appointments.check-out');


    //Medical Records Route
    Route::get('/medical-records', [MedicalRecordController::class, 'index'])->name('medicalrecords.index');
    Route::get('/medical-records/{id}', [MedicalRecordController::class, 'view'])->name('medicalrecords.view');
    Route::delete('/medical-records/{id}', [MedicalRecordController::class, 'deletePatient'])->name('medicalrecords.delete');
    // Route::get('/medical-records/unfinished-docs', [UnfinishedDocsController::class, 'index'])->name('unfinished-docs');
    Route::get('/patient/medical-records/{id}/{appointment_id}', [MedicalRecordController::class, 'get_patient_medical_record'])->name('medicalrecords.medical_record_patient');


    Route::get('/medical-certificate/{id}/{app_id}', [MedicalCertificateController::class, 'show'])
        ->name('medical-certificate.show');
    Route::get('/medical-certificate/patient/info/{id}/{app_id}', [MedicalCertificateController::class, 'getinfo'])
        ->name('medical-certificate.getinfo');

    Route::post('/medical-certificate', [MedicalCertificateController::class, 'store_medical_certificate'])->name('medical-certificate.store');

    Route::post('/appointment-manager/reorder', [AppointmentManagerController::class, 'reorder'])->name('appointments.reorder');
    Route::get('/appointments/poll', [AppointmentManagerController::class, 'poll'])->name('appointments.poll');


    Route::get('/prescriptions/{id}/print/{app_id}', [PrescriptionController::class, 'print'])->name('prescriptions.print');
    Route::get('/laboratory-requests/{id}/print/{app_id}', [LaboratoryRequestController::class, 'print'])->name('laboratory.print');


    Route::get('/laboratory-tests/options', [PatientLaboratoryTestController::class, 'getTestOptions'])->name('laboratory.options');
    Route::get('/laboratory-tests/patient/{patientId}/{app_id}', [PatientLaboratoryTestController::class, 'getPatientTests'])->name('laboratory.patient.tests');
    Route::put('/laboratory-tests/{id}/{pid}', [PatientLaboratoryTestController::class, 'updatePatientTests'])->name('laboratory.patient.tests.update');
    Route::post('/laboratory-tests', [PatientLaboratoryTestController::class, 'store'])->name('laboratory.patient.store');

    Route::post('/laboratory-requests', [LaboratoryRequestController::class, 'store_laboratory_request'])->name('laboratory.store');
    Route::get('/laboratory-requests/{patientId}/{app_id}', [LaboratoryRequestController::class, 'getPatientRequests'])->name('laboratory.patient');

    // Billing routes
    Route::resource('billing', BillingController::class)->except(['create', 'edit', 'show']);
    Route::get('/billing/{patient_id}', [BillingController::class, 'showByPatient'])->name('billing.showByPatient');
    Route::get('/services', [BillingController::class, 'getServices'])->name('billing.services');
    Route::delete('/billing/{id}', [BillingController::class, 'destroy'])->name('billing.destroy');

    // Inventory routes
    Route::get("inventory", [InventoryController::class, 'index'])->name('inventory.index');
    Route::get("inventory/{id}", [InventoryController::class, 'inventory_medication_index'])->name('inventory.medication.index');
    Route::post("inventory", [InventoryController::class, 'add'])->name('inventory.add');
    Route::put("inventory/{id}", [InventoryController::class, 'update'])->name('inventory.update');
    Route::post("inventory-change/{id}", [InventoryController::class, 'inventory_change'])->name('inventory.change.update');
    Route::delete("inventory/{id}", [InventoryController::class, 'delete'])->name('inventory.delete');


    // Settings routes
    Route::get("settings", [SettingsController::class, 'medication'])->name('settings.index');
    Route::get("settings/medication", [SettingsController::class, 'medication'])->name('settings.medication');
    Route::get("settings/services", [SettingsController::class, 'services'])->name('settings.services');
    Route::get("settings/frequency", [SettingsController::class, 'frequency_index'])->name('settings.frequency');
    Route::get("settings/plan", [SettingsController::class, 'plan_index'])->name('settings.plan');
    Route::get("settings/accounts", [SettingsController::class, 'accounts_index'])->name('settings.accounts');
    Route::get("settings/accounts/new/doctor", [SettingsController::class, 'create_account'])->name('settings.accounts.create.doctor');
    Route::get("settings/accounts/new/secretary", [SettingsController::class, 'create_account'])->name('settings.accounts.create.secretary');
    Route::get("settings/accounts/new/admin", [SettingsController::class, 'create_account'])->name('settings.accounts.create.admin');
    Route::get("settings/accounts/edit/{id}", [SettingsController::class, 'update_account'])->name('settings.accounts.update');
    Route::patch("settings/accounts/toggle_status/{id}", [SettingsController::class, 'toggle_user_status'])->name('settings.accounts.toggle_status');
});


Route::middleware(['auth', 'verified', 'role:admin,doctor'])->group(function () {

    Route::get('/medicalrecords/unfinisheddocs', [UnfinishedDocsController::class, 'index'])->name('medicalrecords.unfinisheddocs');
    Route::delete('/patient/{id}', [AllPatientController::class, 'destroy'])->name('patient.destroy');
});







// Route::get('/medicalrecords/viewmedicalrecords/{patient_id}', function () {
//     return Inertia::render('MedicalRecords/ViewMedicalRecords');
// })->middleware(['auth', 'verified'])->name('medicalrecords.viewmedicalrecords');

// Route::get('/medicalrecords/viewmedicalrecord/{patient_id}', function () {
//     return Inertia::render('MedicalRecords/ViewMedicalRecord');
// })->middleware(['auth', 'verified'])->name('medicalrecords.viewmedicalrecord');

Route::get('/medicalrecords/searchrecords', function () {
    return Inertia::render('MedicalRecords/SearchRecords');
})->middleware(['auth', 'verified'])->name('medicalrecords.searchrecords');

// Route::get('/medicalrecords/unfinisheddocs', [UnfinishedDocsController::class, 'index'])
//     ->middleware(['auth', 'verified'])
//     ->name('medicalrecords.unfinisheddocs');

// Route::get('/allpatients', function () {
//     return Inertia::render('AllPatients');
// })->middleware(['auth', 'verified'])->name('allpatients');


// Route::get('/billingrecord', function () {
//     return Inertia::render('BillingRecord');
// })->middleware(['auth', 'verified'])->name('billingrecord');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Add this route to your web.php file
Route::post('/unfinished-docs', [UnfinishedDocsController::class, 'store'])->name('unfinished-docs.store');

// Reminder routes
Route::post('/reminders', [DashboardController::class, 'storeReminder'])->name('reminders.store');
Route::get('/reminders', [DashboardController::class, 'getReminders'])->name('reminders.getting');
Route::put('/reminders/{id}', [DashboardController::class, 'updateReminder'])->name('reminders.update');
Route::delete('/reminders/{id}', [DashboardController::class, 'deleteReminder'])->name('reminders.delete');

require __DIR__ . '/auth.php';
