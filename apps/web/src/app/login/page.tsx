import {SignUpForm} from "@/components/signup-form";

export const metadata = {
  title: "Secure Demo Wallet | Login",
};

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full dark:bg-blue-950">
      <div className="container relative sm:grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-black" />
          <div className="relative z-20 m-auto max-w-sm text-center">
            <blockquote className="space-y-2">
              <div className="space-y-8">
                <p className="text-lg font-medium">
                  ETH Wallet Demo is a reference B2B SaaS application built
                  using Next.js and Rust.
                </p>
                <p className="text-lg">
                  It features user management and eth wallet configuration and
                  more out-of-the-box.
                </p>
              </div>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex h-screen">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
