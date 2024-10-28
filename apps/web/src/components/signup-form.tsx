// noinspection TypeScriptValidateTypes

"use client";

import {SubmitButton} from "@/components/submit-button";
import {Input} from "@v1/ui/input";
import {Label} from "@v1/ui/label";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/spinner";
import {useAuth} from "@/auth/AuthContext";
import {login} from "@/auth/auth.services";
import {verifyEmailAction} from "@/actions/verifyEmailAction";

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { loginEffect } = useAuth();
  const [email, setEmail] = useState<string>('')
  const [isVerified, setIsVerified] = useState<boolean>(false)

  async function handleVerifyEmail(): Promise<void> {
    try {
      const proof = await generateProof(email)
      const response = await verifyEmailAction({ proof })
      response.success ? setIsVerified(true) : setError(response.error ?? 'Verification failed')
    } catch (err) {
      setError('An unexpected error occurred.')
    }
  }

  async function generateProof(email: string): Promise<string> {
    // Use zkEmail SDK or library for proof generation
    return 'sample_proof' // Placeholder
  }

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const email = formData.get("email") as string;

    try {
      await login({ email });
      loginEffect();
      router.push("/wallets");
    } catch (err) {
      console.log({ err });
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Try Crypto Wallet for Free
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address to sign up and create a new organization for
          you and your collaborators.
        </p>
      </div>
      <form action={async (formData: FormData) => handleLogin(formData)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <SubmitButton>Get Started</SubmitButton>
          )}
          {error && (
            <p className="text-red-500 dark:text-red-400 mt-4 text-sm">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
