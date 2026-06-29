import Master from '@/Layout/Master'
import { router, Head } from '@inertiajs/react'

interface ExtensionRequest {
    id: number
    reason: string | null
    status: string
    requested_at: string
    user: { id: number; name: string; email: string }
}

interface Props {
    requests: ExtensionRequest[]
}

export default function ExtensionRequestsIndex({ requests }: Props) {
    function handleApprove(request: ExtensionRequest) {
        router.patch(`/admin/extension-requests/${request.id}/approve`)
    }

    function handleDeny(request: ExtensionRequest) {
        router.patch(`/admin/extension-requests/${request.id}/deny`)
    }

    return (
        <>
            <Head title="Extension Requests" />

            <Master>

                <div className="max-w-4xl mx-auto p-8 space-y-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Extension Requests</h1>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Employee</th>
                                    <th className="px-6 py-3 text-left">Reason</th>
                                    <th className="px-6 py-3 text-left">Requested</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{request.user.name}</p>
                                            <p className="text-xs text-gray-400">{request.user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs">
                                            {request.reason ?? <span className="text-gray-300">No reason given</span>}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(request.requested_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApprove(request)} className="text-green-600 hover:underline text-xs font-medium">Approve</button>
                                                <button onClick={() => handleDeny(request)} className="text-red-600 hover:underline text-xs font-medium">Deny</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                            No pending extension requests.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Master>
        </>
    )
}