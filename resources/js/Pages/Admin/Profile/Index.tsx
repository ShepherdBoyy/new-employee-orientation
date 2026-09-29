import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Master from "@/Layout/Master";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import SignaturePad from "@/components/SignaturePad";
import { PenLine, Trash2 } from "lucide-react";

interface Props {
    user: {
        name: string;
        email: string;
    };
    signature: string | null;
}

function Profile({ user, signature }: Props) {
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isEditingSignature, setIsEditingSignature] = useState(!signature);

    const detailsForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const signatureForm = useForm({
        signature: null as string | null,
    });

    function handleDetailsSubmit(e: React.FormEvent) {
        e.preventDefault();

        detailsForm.put("/admin/profile", {
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success(page.props.success, { position: "top-center" });
            },
        });
    }

    function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();

        passwordForm.put("/admin/profile/password", {
            preserveScroll: true,
            onSuccess: (page) => {
                passwordForm.reset();
                toast.success(page.props.success, { position: "top-center" });
            },
        });
    }

    function handleSignatureSubmit(e: React.FormEvent) {
        e.preventDefault();

        signatureForm.post("/admin/profile/signature", {
            preserveScroll: true,
            onSuccess: (page) => {
                setIsEditingSignature(false);
                toast.success(page.props.success, { position: "top-center" });
            },
        });
    }

    function handleRemoveSignature() {
        signatureForm.delete("/admin/profile/signature", {
            preserveScroll: true,
            onSuccess: (page) => {
                setRemoveDialogOpen(false);
                setIsEditingSignature(true);
                toast.success(page.props.success, { position: "top-center" });
            },
        });
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal details, password, and signature.
                </p>
            </div>
            <form onSubmit={handleDetailsSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>
                            Update your name and email address.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    value={detailsForm.data.name}
                                    onChange={(e) =>
                                        detailsForm.setData(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                />
                                {detailsForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {detailsForm.errors.name}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    value={detailsForm.data.email}
                                    onChange={(e) =>
                                        detailsForm.setData(
                                            "email",
                                            e.target.value,
                                        )
                                    }
                                />
                                {detailsForm.errors.email && (
                                    <p className="text-sm text-destructive">
                                        {detailsForm.errors.email}
                                    </p>
                                )}
                            </Field>
                        </FieldGroup>
                    </CardContent>

                    <CardFooter className="justify-end">
                        <Button type="submit" disabled={detailsForm.processing}>
                            {detailsForm.processing
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <form onSubmit={handlePasswordSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            You'll need to confirm your current password.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="current_password">
                                    Current Password
                                </FieldLabel>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "current_password",
                                            e.target.value,
                                        )
                                    }
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="text-sm text-destructive">
                                        {passwordForm.errors.current_password}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">
                                    New Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "password",
                                            e.target.value,
                                        )
                                    }
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-sm text-destructive">
                                        {passwordForm.errors.password}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password_confirmation">
                                    Confirm New Password
                                </FieldLabel>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={
                                        passwordForm.data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>

                    <CardFooter className="justify-end">
                        <Button
                            type="submit"
                            disabled={passwordForm.processing}
                        >
                            {passwordForm.processing
                                ? "Updating..."
                                : "Update Password"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <Card>
                <CardHeader>
                    <CardTitle>E-Signature</CardTitle>
                    <CardDescription>
                        This signature appears on the acknowledgement
                        certificate PDF whenever you export one.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {!isEditingSignature && signature ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-linear-to-br from-muted/30 to-muted/10 p-4">
                                <img
                                    src={signature}
                                    alt="Your saved signature"
                                    className="h-32 object-contain"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditingSignature(true)}
                                >
                                    <PenLine className="mr-1.5 h-3.5 w-3.5" />
                                    Edit Signature
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => setRemoveDialogOpen(true)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSignatureSubmit}
                            className="space-y-4"
                        >
                            <SignaturePad
                                onChange={(dataUrl) =>
                                    signatureForm.setData("signature", dataUrl)
                                }
                            />

                            {signatureForm.errors.signature && (
                                <p className="text-sm text-destructive">
                                    {signatureForm.errors.signature}
                                </p>
                            )}

                            <div className="flex items-center gap-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        !signatureForm.data.signature ||
                                        signatureForm.processing
                                    }
                                >
                                    {signatureForm.processing
                                        ? "Saving..."
                                        : "Save Signature"}
                                </Button>

                                {signature && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                            setIsEditingSignature(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={removeDialogOpen}
                onOpenChange={setRemoveDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2 />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Remove Signature</AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to remove your saved
                            signature? It will no longer appear on
                            acknowledgement certificates you export until you
                            add a new one.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleRemoveSignature}
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

Profile.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Profile;
