import { Card } from "@/components/ui/card";

export function NumberCard({ title, number, className, icon: Icon }: any) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <span className="text-lg font-light">{title}</span>
          <p className="text-5xl font-extrabold">{number ? number : "--"}</p>
        </div>
        <Icon size={32} />
      </div>
    </Card>
  );
}
