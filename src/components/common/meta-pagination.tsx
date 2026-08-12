import { Pagination } from "./pagination";

export const MetaPagination = ({ meta, label }: any) => {
  if (!meta) return null;

  if (meta?.total <= 10) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <Pagination className="col-start-1 md:col-start-2" meta={meta} />
      <div className="text-sm text-muted-foreground justify-self-end md:col-start-3">
        <span>
          Mostrando <span className="font-medium">{((meta?.current_page - 1) * meta?.per_page) + 1}-{Math.min(meta?.current_page * meta?.per_page, meta?.total)}</span>{" "}
          de <span className="font-medium">{meta?.total || 0}</span> {label || "item(s)"}
        </span>
      </div>
    </div>
  );
};
