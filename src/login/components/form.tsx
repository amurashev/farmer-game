'use client'

import { useState } from 'react'
import { useForm, Controller, SubmitErrorHandler } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

import { getUserByEmail } from '@/endpoints/auth'
import { login } from '@/app/actions/auth'

function FormField({
  label,
  htmlFor,
  description,
  children,
  errorMessage,
}: {
  label: string
  htmlFor: string
  description?: string
  errorMessage?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {errorMessage ? (
        <p className="text-destructive text-xs">{errorMessage}</p>
      ) : null}
      {!errorMessage && description ? (
        <p className="text-muted-foreground text-xs">{description}</p>
      ) : null}
    </div>
  )
}

type FormData = {
  email: string
  password: string
}

function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({})
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const result = await getUserByEmail(data)

    if (result.error) {
      toast({
        description: result.error.message,
        variant: 'destructive',
      })
      setIsLoading(false)
    } else if (result.data?.id) {
      login(result.data?.id)
    }
  }

  const onFormError: SubmitErrorHandler<FormData> = async (err) => {
    console.error(err) // eslint-disable-line no-console
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(onSubmit, onFormError)()
      }}
      className="grid gap-4"
    >
      <Controller
        name="email"
        control={control}
        defaultValue="admin@admin.admin"
        rules={{
          required: {
            value: true,
            message: 'Please enter your email',
          },
        }}
        render={({ field }) => (
          <FormField
            label="Email"
            htmlFor="email"
            errorMessage={errors.email?.message}
          >
            <Input
              type="email"
              placeholder="name@example.com"
              hasError={Boolean(errors.email?.message)}
              {...field}
            />
          </FormField>
        )}
      />

      <Controller
        name="password"
        control={control}
        defaultValue="admin"
        rules={{
          required: {
            value: true,
            message: 'Password is required',
          },
        }}
        render={({ field }) => (
          <FormField
            label="Password"
            htmlFor="password"
            errorMessage={errors.password?.message}
          >
            <Input
              type="password"
              hasError={Boolean(errors.password?.message)}
              {...field}
            />
          </FormField>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        Sign in with Email
      </Button>
    </form>
  )
}

export default Form
