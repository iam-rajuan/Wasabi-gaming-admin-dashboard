'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import Image from 'next/image'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

/* ------------------ Zod Schema ------------------ */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

/* ------------------ Component ------------------ */
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /* ------------------ Submit Handler ------------------ */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true)

      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (res?.error) {
        if (res.error.includes('admin_only')) {
          toast.error('Only admin users can login')
        } else {
          toast.error('Invalid email or password')
        }
        return
      }

      toast.success('Login successful 🎉')
      window.location.href = '/dashboard'
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center space-y-3">
          {/* Logo */}
          <div className="py-7 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Wasabi Gaming Logo"
              width={100}
              height={100}
              priority
            />
          </div>

          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email and admin password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="py-5"
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          {...field}
                          className="py-5"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFFF00] text-black hover:bg-[#FFFF00]/70"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
