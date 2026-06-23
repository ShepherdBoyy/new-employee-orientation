import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { Form } from "@inertiajs/react";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="" style={{ width: "600px" }}>
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <Form action="/login" method="post">
          {({ errors, processing }) => (
              <>
                  <CardContent className="pb-3">
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                      />
                      {errors['email'] && <div className="text-red-700">{errors['email']}</div>}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" name="password" type="password" required/>
                      {errors['password'] && <div className="text-red-700">{errors['password']}</div>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="w-full">
                    { processing && <Spinner data-icon="inline-start" /> }
                    Login
                  </Button>
                </CardFooter>
              </>
          )}
        </Form>
      </Card>
    </div>
  )
}