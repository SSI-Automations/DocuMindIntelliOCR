import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <AuthForm type="login" />
    </div>
  )
}
