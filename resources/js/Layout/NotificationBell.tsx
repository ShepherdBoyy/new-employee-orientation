import { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { Bell, CheckCheck, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
interface NotificationItem {
    id: string;
    message: string;
    read: boolean;
    created_at: string;
    employee_id: number | null;
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    function fetchNotifications() {
        axios.get("/admin/notifications").then((res) => {
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        });
    }

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    function handleOpenChange(isOpen: boolean) {
        setOpen(isOpen);
        if (isOpen) fetchNotifications();
    }

    function handleMarkAsRead(id: string) {
        router.post(
            `/admin/notifications/${id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: fetchNotifications,
            },
        );
    }

    function handleMarkAllAsRead() {
        router.post(
            "/admin/notifications/read-all",
            {},
            {
                preserveScroll: true,
                onSuccess: fetchNotifications,
            },
        );
    }

    function handleClearNotification(id: string) {
        router.delete(
            `/admin/notifications/${id}`,
            {
                preserveScroll: true,
                onSuccess: fetchNotifications
            }
        )
    }

    function handleClearAllNotifications() {
        router.delete(
            `/admin/notifications`,
            {
                preserveScroll: true,
                onSuccess: fetchNotifications
            }
        )
    }

    function handleClick(notification: NotificationItem) {
        if (!notification.read) handleMarkAsRead(notification.id);
        router.visit("/admin/users/employees");
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-90 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <h3 className="font-semibold">Notifications</h3>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount} unread
                        </p>
                    </div>
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

                <ScrollArea className="h-100">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <InboxIcon className="mb-3 size-10 text-muted-foreground/40" />

                            <p className="font-medium">You're all caught up</p>

                            <p className="text-sm text-muted-foreground">
                                No new notifications.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y w-full max-w-lg">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleClick(notification)}
                                    className={cn(
                                        "w-full text-left transition-colors",
                                        "hover:bg-muted/50",
                                        !notification.read && "bg-primary/5",
                                    )}
                                >
                                    <Item className="px-5 py-4" size="xs">
                                        <ItemMedia>
                                            <Avatar className="size-10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    <Bell className="size-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </ItemMedia>
                                        <div className="flex flex-1 items-start justify-between gap-3">
                                            <ItemContent className="flex-1">
                                                <ItemTitle className="text-sm leading-5">
                                                    {notification.message}
                                                </ItemTitle>

                                                <ItemDescription className="mt-1 text-xs">
                                                    {notification.created_at}
                                                </ItemDescription>
                                            </ItemContent>

                                            {!notification.read ? (
                                                <div className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 transition-all duration-200 group-hover:opacity-100"
                                                    onClick={() => handleClearNotification(notification.id)}
                                                >
                                                    <X className="size-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </Item>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={handleClearAllNotifications}
                    >
                        Clear all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
