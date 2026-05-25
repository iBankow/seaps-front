import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { organizationsApi } from "#/features/organizations/api/organizations";
import { initialData } from "#/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Button } from "#/components/ui/button";
import { useCreatePerson } from "../api/persons";
import { useState } from "react";
import z from "zod";
import { formatPhone } from "#/lib/utils";

const formSchema = z.object({
  organization_id: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.email("E-mail inválido").optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export type CreatePersonFormData = z.infer<typeof formSchema>;

export const CreatePersonDialog = ({
  organizationId,
}: {
  organizationId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const createPerson = useCreatePerson();

  const results = useQueries({
    queries: [
      {
        queryKey: ["organizations"],
        queryFn: organizationsApi.list,
        enabled: isOpen,
        initialData,
      },
    ],
  });

  const organizations = results[0].data.data || [];

  const form = useForm<CreatePersonFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization_id: organizationId || "",
      name: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmit = async (data: CreatePersonFormData) => {
    const payload = {
      name: data.name.trim().toUpperCase(),
      email: data.email ? data.email.trim().toUpperCase() : "",
      phone: data.phone ? data.phone.replace(/\D/g, "") : "",
      role: data.role ? data.role.trim().toUpperCase() : "",
      organization_id: data.organization_id || "",
    };

    await createPerson.mutateAsync(payload);

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Criar Responsável</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          id="create-person-form"
          className="flex gap-4 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Criar Novo Responsável</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo responsável.
            </DialogDescription>
          </DialogHeader>
          <Controller
            name="organization_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="organization-id">Orgão</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  disabled
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id="organization-id"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Selecione a Orgão" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Nome do Responsável
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Informe o nome do responsável"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
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
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Informe o email do responsável"
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Telefone</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Informe o telefone do responsável"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  onChange={(e) => {
                    field.onChange(formatPhone(e.target.value));
                  }}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Informe o cargo do responsável"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" tabIndex={1}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="create-person-form" tabIndex={0}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
