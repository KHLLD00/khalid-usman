import { Reveal } from "@/components/site/Reveal";
import { RichText } from "@/components/site/RichText";
import { imageSrc, type ContentBlock, type GalleryImage } from "@/lib/cms";
import { cn } from "@/lib/utils";

const ASPECT: Record<string, string> = {
  auto: "",
  square: "aspect-square object-cover",
  wide: "aspect-[16/9] object-cover",
  tall: "aspect-[3/4] object-cover",
};

export function Figure({
  image,
  className,
  priority = false,
}: {
  image: GalleryImage;
  className?: string;
  priority?: boolean;
}) {
  const src = imageSrc(image.url);
  if (!src) return null;

  return (
    <figure className={className}>
      <div className="overflow-hidden bg-secondary">
        <img
          src={src}
          alt={image.alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("w-full", ASPECT[image.aspect ?? "auto"] ?? "")}
        />
      </div>
      {image.caption ? (
        <figcaption className="type-meta mt-3 text-muted-foreground">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <Reveal as="section" className="shell">
          <h2 className="type-h2 max-w-[24ch]">{block.text}</h2>
        </Reveal>
      );

    case "rich-text":
      return (
        <Reveal as="section" className="shell">
          <div className="md:grid md:grid-cols-12">
            <div className="md:col-span-7 md:col-start-4">
              <RichText text={block.text} />
            </div>
          </div>
        </Reveal>
      );

    case "quote":
      return (
        <Reveal as="section" className="shell">
          <blockquote className="md:grid md:grid-cols-12">
            <p className="type-serif type-h2 md:col-span-9 md:col-start-3">{block.text}</p>
            {block.attribution ? (
              <footer className="type-meta mt-6 text-muted-foreground md:col-span-9 md:col-start-3">
                {block.attribution}
              </footer>
            ) : null}
          </blockquote>
        </Reveal>
      );

    case "image": {
      if (block.width === "full") {
        return (
          <Reveal as="section">
            <Figure image={block.image} />
          </Reveal>
        );
      }
      return (
        <Reveal as="section" className="shell">
          <Figure
            image={block.image}
            className={block.width === "text" ? "mx-auto max-w-[68ch]" : undefined}
          />
        </Reveal>
      );
    }

    case "gallery":
      return (
        <Reveal as="section" className="shell">
          <div
            className={cn(
              "grid gap-4 md:gap-6",
              block.columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2",
            )}
          >
            {block.images.map((image, index) => (
              <Figure key={index} image={image} />
            ))}
          </div>
        </Reveal>
      );

    case "compare":
      return (
        <Reveal as="section" className="shell">
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
            {block.images.slice(0, 2).map((image, index) => (
              <Figure key={index} image={image} />
            ))}
          </div>
        </Reveal>
      );

    case "text-image":
      return (
        <Reveal as="section" className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-16">
            <div className="md:col-span-5">
              {block.heading ? <h3 className="type-h3 mb-4">{block.heading}</h3> : null}
              <RichText text={block.text} />
            </div>
            <Figure image={block.image} className="md:col-span-7" />
          </div>
        </Reveal>
      );

    case "video":
      return (
        <Reveal as="section" className="shell">
          <figure>
            <div className="aspect-video w-full overflow-hidden bg-secondary">
              <iframe
                src={block.url}
                title={block.caption ?? "Project video"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            {block.caption ? (
              <figcaption className="type-meta mt-3 text-muted-foreground">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      );

    case "metrics":
      return (
        <Reveal as="section" className="shell">
          <dl className="grid gap-10 border-t pt-10 sm:grid-cols-2 md:grid-cols-3">
            {block.items.map((item, index) => (
              <div key={index}>
                <dt className="type-label text-muted-foreground">{item.label}</dt>
                <dd className="type-h2 mt-3">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      );

    case "timeline":
      return (
        <Reveal as="section" className="shell">
          <ol className="grid gap-px bg-border sm:grid-cols-2 md:grid-cols-4">
            {block.items.map((item, index) => (
              <li key={index} className="bg-background p-6">
                <span className="type-label text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-4">{item.label}</h3>
                {item.description ? (
                  <p className="type-small mt-2 text-muted-foreground">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </Reveal>
      );

    default:
      return null;
  }
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <div className="space-y-20 md:space-y-32">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
