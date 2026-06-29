import { useForm, Head } from '@inertiajs/react'

interface Props {
    hasPendingRequest: boolean
}

export default function AccountLocked({ hasPendingRequest }: Props) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        reason: '',
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post('/orientation/extension-request')
    }

    return (
        <>
            <Head title="Account Locked" />
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full space-y-6">

                    {/* Lock icon + heading */}
                    <div className="text-center space-y-2">
                        <div className="text-5xl">🔒</div>
                        <h1 className="text-xl font-semibold text-white">
                            Your account has been locked
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Your 24-hour orientation window has expired.
                            You can request an extension from your HR administrator.
                        </p>
                    </div>

                    {/* Already has pending request */}
                    {hasPendingRequest && (
                        <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-2xl p-5 text-center space-y-1">
                            <p className="text-yellow-300 text-sm font-medium">
                                Request submitted
                            </p>
                            <p className="text-yellow-400/70 text-xs">
                                Your extension request is pending review.
                                Please wait for your administrator to respond.
                            </p>
                        </div>
                    )}

                    {/* Success message */}
                    {wasSuccessful && (
                        <div className="bg-green-900/40 border border-green-700/50 rounded-2xl p-5 text-center space-y-1">
                            <p className="text-green-300 text-sm font-medium">
                                Request submitted successfully
                            </p>
                            <p className="text-green-400/70 text-xs">
                                Your administrator has been notified and will review your request shortly.
                            </p>
                        </div>
                    )}

                    {/* Extension Request Form */}
                    {!hasPendingRequest && !wasSuccessful && (
                        <div className="bg-gray-800 rounded-2xl p-6 space-y-4">
                            <h2 className="text-sm font-medium text-gray-300">
                                Request an extension
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                        Reason for extension
                                    </label>
                                    <textarea
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        rows={4}
                                        placeholder="Please explain why you need more time to complete the orientation..."
                                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                    {errors.reason && (
                                        <p className="text-red-400 text-xs mt-1">{errors.reason}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}