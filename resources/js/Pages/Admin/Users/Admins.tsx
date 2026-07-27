import { useEffect, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Master from "@/Layout/Master";

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface Props {
    admins: Admin[];
}

export default function Admins({ admins: initialAdmins }: Props) {
    const [admins, setAdmins] = useState(initialAdmins);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

    useEffect(() => setAdmins(initialAdmins), [initialAdmins]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        role: "admin",
    });

    function openCreate() {
        setEditingAdmin(null);
        reset();
        setData("role", "admin");
        setDialogOpen(true);
    }

    function openEdit(admin: Admin) {
        setEditingAdmin(admin);
        setData({ name: admin.name, email: admin.email, role: "admin" });
        setDialogOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingAdmin) {
            put(`/admin/users/${editingAdmin.id}`, {
                onSuccess: () => {
                    reset();
                    setDialogOpen(false);
                },
            });
        } else {
            post("/admin/users", {
                onSuccess: () => {
                    reset();
                    setDialogOpen(false);
                },
            });
        }
    }

    function handleDeleteConfirm() {
        if (deletingAdmin) {
            router.delete(`/admin/users/${deletingAdmin.id}`, {
                preserveScroll: true,
            });
            setDeletingAdmin(null);
        }
    }

    return (
        <Master>
            <div className="w-full space-y-6 ">
                <div className="flex items-center justify-between border-b pb-5">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Admins
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage platform administrator accounts.
                        </p>
                    </div>
                    <Button onClick={openCreate} size="lg">
                        <Plus className="mr-2 h-4 w-4" />
                        New Admin
                    </Button>
                </div>

                {admins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">No admins yet</p>
                            <p className="text-xs text-muted-foreground">
                                Create one to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">
                                                        {admin.name
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {admin.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {admin.email}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        openEdit(admin)
                                                    }
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        setDeletingAdmin(admin)
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAdmin ? "Edit Admin" : "New Admin"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAdmin
                                ? "Update the admin details below."
                                : "Create a new administrator account."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Juan Dela Cruz"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="admin@company.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? "Saving..."
                                    : editingAdmin
                                      ? "Save Changes"
                                      : "Create Admin"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deletingAdmin}
                onOpenChange={(o) => !o && setDeletingAdmin(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2 />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this administrator's
                            access. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Master>
    );
}
