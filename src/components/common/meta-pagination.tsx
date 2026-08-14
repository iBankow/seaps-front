import { Pagination } from "./pagination";

export const MetaPagination = ({ meta, label }: any) => {
  if (!meta) return null;

  if (meta?.total <= 10) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center rounded-md p-2">
      <Pagination className="col-start-1 md:col-start-2" meta={meta} />
      <div className="justify-self-end font-mono text-[11px] text-muted-foreground md:col-start-3">
        <span>
          Mostrando{" "}
          <span className="text-foreground">
            {(meta?.current_page - 1) * meta?.per_page + 1}-
            {Math.min(meta?.current_page * meta?.per_page, meta?.total)}
          </span>{" "}
          de <span className="text-foreground">{meta?.total || 0}</span>{" "}
          {label || "item(s)"}
        </span>
      </div>
    </div>
  );
};
