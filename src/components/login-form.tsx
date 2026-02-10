import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-contexts";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Insira seu email",
    })
    .email({
      message: "Insira um email valido",
    }),
  password: z.string().min(2, {
    message: "Insira sua senha",
  }),
});

export function LoginForm() {
  const router = useRouter();

  const [isShow, setIsShow] = useState(false);

  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    login(values.email, values.password).then(() =>
      router.navigate({ to: "/" }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="ml-3">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Insira seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="ml-3">Senha</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Insira sua senha"
                      type={isShow ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    className="min-w-9"
                    size={"icon"}
                    onClick={() => setIsShow(!isShow)}
                  >
                    {isShow ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-6 w-full font-bold">
            ENTRAR
          </Button>
        </form>
      </Form>
    </div>
  );
}
