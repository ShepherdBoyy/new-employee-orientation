<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orientation Completed</title>
    <!--[if mso]>
    <style>
        table { border-collapse: collapse; }
        * { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <!-- Poppins (falls back gracefully in clients that strip <link>/<style> imports) -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 48px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color:#ffffff;">

                    <tr>
                        <td style="background-color: #000000; padding: 40px 40px 36px 40px; border-radius: 20px 20px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
                                Orientation Completed
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 40px 8px 40px; background-color: #ffffff;">
                            <h2 style="margin: 0 0 22px 0; font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">
                                {{ $employeeName }} has finished their orientation
                            </h2>

                            <p style="margin: 0 0 28px 0; font-family: 'Poppins', sans-serif; font-size: 14px; line-height: 24px; color: #4b5563; font-weight: 400;">
                                They have completed all required modules and submitted their final
                                acknowledgement, including their electronic signature and photo confirmation.
                            </p>

                            {{-- Summary card --}}
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fc; border-radius: 16px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 22px 24px 18px 24px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                            Employee
                                        </p>
                                        <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 500; color: #111827;">
                                            {{ $employeeName }}
                                        </p>
                                        <p style="margin: 3px 0 0 0; font-family: 'Poppins', sans-serif; font-size: 13px; color: #6b7280; font-weight: 400;">
                                            {{ $employeeEmail }}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 24px;">
                                        <div style="border-top: 1px solid #eceef2;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 18px 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50%" style="vertical-align: top;">
                                                    <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                                        Company
                                                    </p>
                                                    <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; color: #111827;">
                                                        {{ $companyName }}
                                                    </p>
                                                </td>
                                                <td width="50%" style="vertical-align: top;">
                                                    <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                                        Job Position
                                                    </p>
                                                    <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; color: #111827;">
                                                        {{ $jobPosition ?? '—' }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 24px;">
                                        <div style="border-top: 1px solid #eceef2;"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 18px 24px 22px 24px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                            Acknowledged At
                                        </p>
                                        <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 500; color: #111827;">
                                            {{ $acknowledgedAt }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $viewUrl }}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; padding: 14px 36px; border-radius: 12px;">
                                            View Employee Record
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 32px 0 0 0; font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 19px; color: #9ca3af; text-align: center; font-weight: 400;">
                                You can review their signature and photo confirmation from the employee's detail view.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 28px 40px; background-color: #ffffff; text-align: center;">
                            <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 12px; color: #d1d5db; font-weight: 400;">
                                &copy; {{ date('Y') }} New Employee Orientation. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>