import { cn } from "@/lib/utils";
import React from "react";

type PropType = {
  selected: boolean;
  index: number;
  image: any;
  onClick: () => void;
};

export const CarouselButton: React.FC<PropType> = (props) => {
  const { selected, onClick } = props;

  return (
    <div className={"embla-thumbs__slide"}>
      <button
        onClick={onClick}
        type="button"
        className={cn(
          "embla-thumbs__slide__number overflow-hidden rounded-sm",
          selected && "border-2 border-sky-400"
        )}
      >
        <img
          src={import.meta.env.VITE_BUCKET_URL + props.image.image}
          alt="image"
          width={100}
          height={100}
          className="aspect-square h-full w-full object-cover"
          loading="lazy"
        />
      </button>
    </div>
  );
};
