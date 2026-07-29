import { useEffect, useState } from 'react'
import axios from 'axios'
import { router } from '@inertiajs/react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationItem {
    id: string
    message: string
    read: boolean
    created_at: string
    employee_id: number | null
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    function fetchNotifications() {
        axios.get('/admin/notifications').then(res => {
            setNotifications(res.data.notifications)
            setUnreadCount(res.data.unread_count)
        })
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen)
        if (isOpen) fetchNotifications()
    }

    function handleMarkAsRead(id: string) {
        router.post(`/admin/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: fetchNotifications,
        })
    }

    function handleMarkAllAsRead() {
        router.post('/admin/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: fetchNotifications,
        })
    }

    function handleClick(notification: NotificationItem) {
        if (!notification.read) handleMarkAsRead(notification.id)
        router.visit('/admin/users/employees')
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No notifications yet.
                        </p>
                    ) : (
                        <div className="divide-y">
                            {notifications.map(notification => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleClick(notification)}
                                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                                        !notification.read ? 'bg-primary/5' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {!notification.read && (
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        )}
                                        <p className="text-sm leading-snug">{notification.message}</p>
                                    </div>
                                    <p className="pl-3.5 text-xs text-muted-foreground">
                                        {notification.created_at}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}