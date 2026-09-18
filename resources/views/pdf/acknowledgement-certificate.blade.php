<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 18px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Geist Variable', sans-serif;
            font-size: 11px;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        .certificate {
            border: 2px solid #000000;
            padding: 0;
        }

        .certificate-inner {
            border: 1px solid #cccccc;
            margin: 5px;
            padding: 20px 32px 18px 32px;
        }

        .accent-bar {
            height: 4px;
            background-color: #000000;
            margin: -20px -32px 16px -32px;
        }

        .header {
            text-align: center;
            margin-bottom: 12px;
        }

        .eyebrow {
            font-size: 9.5px;
            font-weight: bold;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #000000;
            margin: 0 0 5px 0;
        }

        .title {
            font-size: 19px;
            font-weight: bold;
            color: #000000;
            margin: 0;
        }

        .info-line {
            width: 100%;
            border-collapse: collapse;
            padding: 20px 0px;
        }

        .info-line td {
            width: 25%;
        }

        .info-line td:first-child {
            text-align: left;
        }

        .info-line td:last-child {
            text-align: right
        }

        .info-label {
            display: block;
            font-size: 7.5px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #999999;
            margin-bottom: 5px;
        }

        .info-value {
            display: block;
            font-size: 12px;
            font-weight: bold;
            color: #000000;
            padding: 5px;
        }

        .section-title {
            font-size: 11.5px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin: 0 0 8px 0;
        }

        .modules-wrap {
            margin-bottom: 4px;
        }

        .module-card {
            border: 1px solid #dddddd;
            border-radius: 4px;
            margin-bottom: 6px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
            -webkit-column-break-inside: avoid;
        }

        .module-header {
            background-color: #f2f2f2;
            border-left: 3px solid #000000;
            padding: 5px 12px;
            font-size: 10.5px;
            font-weight: bold;
            color: #000000;
            page-break-after: avoid;
            break-after: avoid;
        }

        .topics-table {
            width: 100%;
            border-collapse: collapse;
        }

        .topics-table tr+tr td {
            border-top: 1px solid #f0f0f0;
        }

        .topics-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .topic-text-cell {
            padding: 4px 8px 4px 14px;
            vertical-align: middle;
            font-size: 9.5px;
            color: #333333;
            text-align: left;
        }

        .topic-check-cell {
            width: 30px;
            padding: 4px 14px 4px 8px;
            vertical-align: middle;
            text-align: right;
        }

        .checkmark-wrap {
            position: relative;
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1.4px solid #000000;
            border-radius: 3px;
            background-color: transparent;
        }

        .checkmark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.6);
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9px;
            font-weight: bold;
            line-height: 1;
            color: #000000;
        }

        .statement {
            font-size: 9px;
            line-height: 14px;
            color: #444444;
            font-style: italic;
            margin: 14px 0 16px 0;
            padding: 10px 14px;
            background-color: #f7f7f7;
            border-left: 3px solid #cccccc;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .sign-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px 0;
            margin: 0 0 12px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .sign-table td {
            width: 50%;
            vertical-align: bottom;
        }

        .sign-box {
            padding: 6px 0 0 0;
            text-align: center;
        }

        .sign-image {
            display: block;
            margin: 0 auto;
            max-height: 46px;
            max-width: 100%;
        }

        .sign-caption {
            font-size: 8.5px;
            color: #555555;
            margin-top: 6px;
            border-top: 1px solid #dddddd;
            padding-top: 5px;
        }

        .sign-caption strong {
            color: #000000;
        }

        .photo-section {
            margin: 0 0 2px 0;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .photo-box {
            padding: 6px 0 0 0;
            text-align: center;
        }

        .photo-image {
            max-height: 200px;
            max-width: 100%;
        }

        .photo-caption {
            font-size: 8.5px;
            color: #555555;
            margin-top: 6px;
            padding-top: 5px;
        }

        .footer {
            margin-top: 14px;
            padding-top: 8px;
            font-size: 7.5px;
            color: #999999;
            text-align: center;
            line-height: 11px;
        }

        .hash {
            font-family: 'DejaVu Sans Mono', monospace;
            font-size: 7px;
            word-break: break-all;
            margin-top: 2px;
        }
    </style>
</head>

<body>

    <div class="certificate">
        <div class="certificate-inner">
            <div class="accent-bar"></div>

            <div class="header">
                {{-- <p class="eyebrow">Certificate of Completion</p> --}}
                <p class="title">Employee Orientation Acknowledgment Form</p>
            </div>

            <table class="info-line">
                <tr>
                    <td>
                        <span class="info-value">{{ $employeeName }}</span>
                        <span class="info-value">{{ $jobPosition ?? '—' }}</span>
                    </td>
                    <td>
                        <span class="info-value">{{ $companyName }}</span>
                        <span class="info-value">{{ $acknowledgedAt }}</span>
                    </td>
                </tr>
            </table>

            <p class="section-title">Modules Completed</p>

            <div class="modules-wrap">
                @foreach ($modules as $module)
                    <div class="module-card">
                        <div class="module-header">{{ $module['name'] }}</div>
                        @if (!empty($module['key_topics']))
                            <table class="topics-table">
                                @foreach ($module['key_topics'] as $topic)
                                    <tr>
                                        <td class="topic-text-cell">{{ $topic }}</td>
                                        <td class="topic-check-cell">
                                            <div class="checkmark-wrap">
                                                <span class="checkmark">&#10003;</span>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        @else
                            <table class="topics-table">
                                <tr>
                                    <td class="topic-text-cell">Module completed</td>
                                    <td class="topic-check-cell">
                                        <div class="checkmark-wrap">
                                            <span class="checkmark">&#10003;</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        @endif
                    </div>
                @endforeach
            </div>

            @if ($hasJobDescription)
                <div class="modules-wrap">
                    <div class="module-card">
                        <div class="module-header">Job Description / KPI</div>
                        <table class="topics-table">
                            <tr>
                                <td class="topic-text-cell">
                                    Reviewed on {{ $jdViewedAt ?? '—' }}
                                </td>
                                <td class="topic-check-cell">
                                    <div class="checkmark-wrap">
                                        <span class="checkmark">&#10003;</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            @endif

            <div class="statement">
                This certifies that the employee has completed the orientation program, including all modules listed
                above. The employee hereby acknowledges receipt and understanding of the information presented during
                the program and agrees to uphold and comply with the company's policies, procedures, guidelines, and
                standards communicated as part of the orientation.
            </div>

            <div class="photo-section">
                <div class="photo-box">
                    <img src="{{ $photoPath }}" class="photo-image">
                    <p class="photo-caption">Identity Confirmation Photo</p>
                </div>
            </div>

            <table class="sign-table">
                <tr>
                    <td>
                        <div class="sign-box">
                            <img src="{{ $signaturePath }}" class="sign-image">
                            <p class="sign-caption">
                                <strong>{{ $fullNameConfirmation }}</strong><br>
                                Employee Signature
                            </p>
                        </div>
                    </td>
                    <td>
                        <div class="sign-box">
                            <p class="sign-caption">
                                <strong>{{ $hrAdminName }}</strong><br>
                                HR Administrator Signature
                            </p>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="footer">
                <p>
                    This was electronically generated by the New Employee Orientation System and serves as
                    an official digital record of the employee's completion and acknowledgment of the orientation
                    program. Generated on {{ $generatedAt }}.
                </p>
            </div>
        </div>
    </div>

</body>

</html>
