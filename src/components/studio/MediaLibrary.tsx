import { useQuery } from "@tanstack/react-query";

import { imageSrc } from "@/lib/cms";
import { listImages } from "@/lib/media";
import { describeSupabaseError } from "@/lib/studio";

/** Modal listing every image already uploaded, so one file can be reused across fields. */
export function MediaLibrary({
  onSelect,
  onClose,
}: {
  onSelect: (path: string) => void;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["media-library"],
    queryFn: listImages,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-auto border bg-background p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="type-h3">Uploaded images</h3>
          <button type="button" onClick={onClose} className="type-meta link-underline">
            Close
          </button>
        </div>

        {isLoading ? (
          <p className="type-meta mt-6 text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="type-meta mt-6">{describeSupabaseError(error)}</p>
        ) : !data?.length ? (
          <p className="type-meta mt-6 text-muted-foreground">
            Nothing uploaded yet. Upload an image from any field first.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {data.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onSelect(item.path)}
                className="group block text-left"
              >
                <img
                  src={imageSrc(item.path)}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full bg-secondary object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
                <span className="type-meta mt-2 block truncate text-muted-foreground">
                  {item.path}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
