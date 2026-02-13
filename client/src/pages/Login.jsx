import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { loginApi } from "../features/auth/authApi.js";
import { setToken } from "../lib/auth.js";

export default function Login() {
  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" }
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.accessToken);
      window.location.href = "/";
    }
  });

  const onSubmit = async (values) => mutation.mutateAsync(values);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full rounded-xl bg-white p-6 shadow-card ring-1 ring-slate-200">
          <h1 className="text-lg font-semibold">Login</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage roles & permissions
          </p>

          <div className="mt-5 space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Email</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="admin@example.com"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Admin@123"
                {...register("password", { required: true })}
              />
            </div>

            {mutation.isError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {mutation.error?.response?.data?.message || "Login failed"}
              </div>
            ) : null}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={mutation.isPending}
              className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Seed admin: <span className="font-medium">admin@example.com</span> /{" "}
            <span className="font-medium">Admin@123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
