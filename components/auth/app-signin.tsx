import { BtnGoogleSignIn } from "./btn-signin"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSeparator,
  FieldGroup,
} from "@/components/ui/field"

export function CardDemo() {
  return (
    <div className="w-full flex items-center justify-center p-10 h-full">
      <Card className="w-full max-w-sm">
        <img
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="relative z-20 aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Sign in with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BtnGoogleSignIn />
        </CardContent>
      </Card>
    </div>
  )
}