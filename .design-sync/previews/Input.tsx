import { Input } from "seaps-front";

export function Default() {
  return <Input placeholder="Procure pelo imóvel" className="w-72" />;
}

export function WithValue() {
  return <Input defaultValue="0200/26 - DETRAN" className="w-72" />;
}

export function DisabledAndInvalid() {
  return (
    <div className="flex w-72 flex-col gap-3">
      <Input disabled defaultValue="Desabilitado" />
      <Input aria-invalid defaultValue="valor inválido" />
    </div>
  );
}
