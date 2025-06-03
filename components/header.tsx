"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold">DocuMind</span>
        </Link>

        {!isAuthPage && (
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
