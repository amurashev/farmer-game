import Form from './components/form'

export default function LoginPage() {
  return (
    <main className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="space-y-4 w-[400px] flex-1 flex-shrink-0">
        <h3 className="text-3xl font-bold">Sign in</h3>
        <Form />
      </div>
    </main>
  )
}
