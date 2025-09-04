import { Pagination } from "./pagination";

export const MetaPagination = ({ meta }: any) => {
  if (!meta) return null;

  if (meta?.total <= 10) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <Pagination className="col-start-1 md:col-start-2" meta={meta} />
      <p className="justify-self-end">Total de {meta?.total} item(s)</p>
    </div>
  );
};
