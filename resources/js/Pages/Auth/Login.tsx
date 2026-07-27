import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Rotate3d } from "lucide-react";
import { Form } from "@inertiajs/react";

export default function Login() {
    return (
        <div className="flex min-h-screen p-4 lg:p-8 items-center justify-center font-poppins bg-slate-50">
            {/* CONTAINER  */}
            <div className="grid lg:grid-cols-2 w-full max-w-7xl rounded-3xl border-slate-200 shadow-2xl bg-background p-3 lg:min-h-180">
                {/* LEFT SIDE */}

                <div className="relative hidden lg:flex h-full flex-col rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
                    <div className="absolute inset-0">
                        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
                    </div>
                    <div className="flex items-center gap-2 p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                            <Rotate3d size={20} strokeWidth={1.8} />
                        </div>

                        <span className="font-medium">NEO</span>
                    </div>
                    <div className="mt-auto p-12">
                        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">
                            New Employee Orientation
                        </p>
                        <h1 className="text-5xl leading-tight tracking-tight">
                            Everything you need to get started.
                        </h1>

                        <p className="mt-4 text-white/80 leading-relaxed">
                            Access onboarding materials, orientation modules,
                            and company resources— all in one place.
                        </p>
                    </div>
                </div>
                {/* Right Side */}
                <Form
                    action="/login"
                    method="post"
                    className="flex items-center justify-center p-6 lg:p-12"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="w-full max-w-md lg:px-0">
                                <div className="mb-10 flex flex-col items-center lg:hidden">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                                        <Rotate3d size={22} />
                                    </div>

                                    <span className="mt-3 font-semibold tracking-wide">
                                        NEO
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                                    Welcome Back
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Sign in with your company account to
                                    continue.
                                </p>

                                <div className="space-y-6 py-8 lg:space-y-8 lg:py-14">
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                className="h-10 lg:h-11"
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your work email"
                                                required
                                            />
                                            {errors["email"] && (
                                                <div className="text-red-700">
                                                    {errors["email"]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid gap-2 ">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                            </div>
                                            <Input
                                                className="h-10 lg:h-11"
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                required
                                            />
                                            {errors["password"] && (
                                                <div className="text-red-700">
                                                    {errors["password"]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11">
                                    {processing && (
                                        <Spinner data-icon="inline-start" />
                                    )}
                                    Sign in
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
