<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Medical Prescription</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header img {
            max-width: 200px;
            margin-bottom: 10px;
        }
        .patient-info {
            margin-bottom: 30px;
        }
        .patient-info div {
            margin-bottom: 5px;
        }
        .rx-symbol {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .medication {
            margin-bottom: 15px;
            padding-left: 20px;
        }
        .doctor-info {
            margin-top: 50px;
            text-align: right;
        }
        .doctor-signature {
            margin-bottom: 10px;
        }
        .doctor-details {
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/garcia-logo.png') }}" alt="Garcia Medical Clinic">
        <div>MEDICAL CLINIC & DIAGNOSTIC LABORATORY</div>
    </div>

    <div class="patient-info">
        <div>
            <span style="width: 120px; display: inline-block;">Patient Name:</span>
            <span>{{ $prescription->patient_name }}</span>
        </div>
        <div>
            <span style="width: 120px; display: inline-block;">Address:</span>
            <span>{{ $prescription->address }}</span>
        </div>
        <div>
            <span style="width: 120px; display: inline-block;">Age/Sex:</span>
            <span>{{ $prescription->age }}/{{ $prescription->sex }}</span>
        </div>
        <div>
            <span style="width: 120px; display: inline-block;">Date:</span>
            <span>{{ $prescription->date }}</span>
        </div>
    </div>

    <div class="rx-symbol">℞</div>

    @foreach($prescription->medications as $medication)
    <div class="medication">
        <div>{{ $medication->name }} ({{ $medication->brand }})</div>
        <div style="padding-left: 20px;">
            Sig: {{ $medication->sig }}
        </div>
    </div>
    @endforeach

    <div class="doctor-info">
        <div class="doctor-signature">
            _______________________
        </div>
        <div class="doctor-details">
            <div>{{ $prescription->doctor_name }}</div>
            <div>License No. {{ $prescription->license_no }}</div>
            <div>PTR No. {{ $prescription->ptr_no }}</div>
        </div>
    </div>
</body>
</html> 