import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Rotate3d } from "lucide-react";
import { Form } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
 
export default function Login() {
    const page = usePage();
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 p-6 lg:p-12 ">
            {/* CONTAINER  */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/20 blur-[10px]" />

            <div className="grid lg:grid-cols-[0.95fr_1.05fr] w-full max-w-7xl rounded-3xl border-slate-200 lg:shadow-2xl  p-3 lg:min-h-180">
                {/* LEFT SIDE */}
                <div className="relative hidden lg:flex h-full flex-col rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
                    <div className="absolute inset-0">
                        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
                    </div>
                    <div className="flex items-center gap-2 p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur">
                            <Rotate3d
                                size={24}
                                absoluteStrokeWidth
                                strokeWidth={1.3}
                            />
                        </div>

                        <span className="font-medium">NEO</span>
                    </div>
                    <div className="mt-auto p-12">
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/50">
                            New Employee Orientation
                        </p>

                        <h1 className="mt-6 text-5xl font-medium tracking-tight leading-[1.4]">
                            Everything you need to get started.
                        </h1>

                        <p className="mt-4 text-white/80 leading-relaxed text-md">
                            Access onboarding materials, orientation modules,
                            and company resources— all in one place.
                        </p>
                    </div>
                </div>
                {/* Right Side */}
                <Form
                    action="/login"
                    method="post"
                    className="flex items-center justify-center p-6 bg-slate-50/40"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="w-full max-w-md lg:px-0">
                                <div className="mb-10 flex flex-col items-center lg:hidden">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                        <Rotate3d
                                            size={22}
                                            absoluteStrokeWidth
                                            strokeWidth={1.3}
                                        />
                                    </div>

                                    <span className="mt-3 font-semibold tracking-wide">
                                        NEO
                                    </span>
                                </div>
                                <h1 className="text-2xl lg:text-3xl tracking-tight lg:text-left text-center">
                                    Welcome Back
                                </h1>
                                <p className="mt-2 text-sm lg:text-base text-muted-foreground lg:text-left text-center lg:max-w-2xl ">
                                    Sign in with your company account to
                                    continue.
                                </p>

                                <div className="mt-12 space-y-6">
                                    <div className="flex flex-col gap-6">
                                        <div className="space-y-5">
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
                                <div className="pt-8 ">
                                    <Button
                                        type="submit"
                                        className="w-full h-10 lg:h-12 rounded-xl font-semibold shadow-2xl"
                                    >
                                        {processing && (
                                            <Spinner data-icon="inline-start" />
                                        )}
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
