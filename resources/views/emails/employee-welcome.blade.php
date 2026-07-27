<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NEO</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 48px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color:#ffffff;">

                    <tr>
                        <td style="background-color: #000000; padding: 40px 40px 36px 40px; border-radius: 20px 20px 0 0; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: -0.01em;">
                                New Employee Orientation
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 40px 8px 40px; background-color: #ffffff;">
                            <h2 style="margin: 0 0 22px 0; font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.01em;">
                                Hello, {{ $employeeName }} 👋
                            </h2>

                            <p style="margin: 0 0 28px 0; font-family: 'Poppins', sans-serif; font-size: 14px; line-height: 24px; color: #4b5563; font-weight: 400;">
                                Your account has been created for the orientation program at
                                <strong style="font-weight: 600; color: #111827;">{{ $companyName }}</strong>@if($jobPosition) as a <strong style="font-weight: 600; color: #111827;">{{ $jobPosition }}</strong>@endif.
                                Use the credentials below to log in and get started.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fc; border-radius: 16px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px 24px 10px 24px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                            Email
                                        </p>
                                        <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 500; color: #111827;">
                                            {{ $email }}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 24px 24px 24px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af;">
                                            Password
                                        </p>
                                        <p style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 500; color: #111827;">
                                            {{ $password }}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8e6; border-radius: 14px; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 16px 20px; font-family: 'Poppins', sans-serif; font-size: 13px; line-height: 20px; color: #92400e; font-weight: 400;">
                                        ⏱️ You have <strong style="font-weight: 600;">{{ $expiresInDays }} days</strong> from today to complete your orientation. After that, your access will expire.
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $loginUrl }}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; padding: 14px 36px; border-radius: 12px;">
                                            Start Orientation
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 32px 0 0 0; font-family: 'Poppins', sans-serif; font-size: 12px; line-height: 19px; color: #9ca3af; text-align: center; font-weight: 400;">
                                If you did not expect this email, please contact your administrator.
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