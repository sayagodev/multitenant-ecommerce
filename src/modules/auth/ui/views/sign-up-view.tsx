"use client";

import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Poppins } from "next/font/google";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

import { registerSchema } from "../../schemas";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const SignUpView = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const register = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/");
    },
  }));

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register.mutate(values)
  }

  const username = form.watch("username")
  const usernameErrors = form.formState.errors.username

  const showPreview = username && !usernameErrors

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 p-4 lg:p-16"
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <span className={cn("text-2xl font-semibold", poppins.className)}>
                funroad
              </span>
            </Link>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-base border-none underline"
            >
              <Link prefetch href="/sign-in">
                Sign in
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-medium">
            Join over 1,580 creators earning money on Funroad.
          </h1>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base">Username</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription
                  className={cn("hidden", field.value && !fieldState.invalid && "block")}
                >
                  Your store will be available at&nbsp;
                  <strong>{username}</strong>.shop.com
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base">Email</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base">Password</FieldLabel>
                <Input
                  {...field}
                  type="password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base">Confirm Password</FieldLabel>
                <Input
                  {...field}
                  type="password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            disabled={register.isPending}
            type="submit"
            size="lg"
            variant="elevated"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary"
          >
            Create account
          </Button>
        </form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
