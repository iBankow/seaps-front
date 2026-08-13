import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
} from "seaps-front";

export function Default() {
  return (
    <FieldGroup className="w-72">
      <Field>
        <FieldLabel htmlFor="ds-field-org">Órgão</FieldLabel>
        <Input id="ds-field-org" placeholder="DETRAN" />
        <FieldDescription>Órgão responsável pelo imóvel.</FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="ds-field-addr">Endereço</FieldLabel>
        <Input id="ds-field-addr" aria-invalid />
        <FieldError>Endereço é obrigatório.</FieldError>
      </Field>
    </FieldGroup>
  );
}
