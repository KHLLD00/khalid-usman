import { Reveal } from "@/components/site/Reveal";
import { imageSrc, type Experiment } from "@/lib/cms";

function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const src = imageSrc(experiment.image_url);
  const meta = [experiment.category, experiment.year].filter(Boolean).join(" · ");

  const content = (
    <>
      {src ? (
        <div className="overflow-hidden bg-secondary">
          <img
            src={src}
            alt={experiment.image_alt || experiment.title}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-secondary" aria-hidden />
      )}
      <div className="mt-4">
        {meta ? <p className="type-meta text-muted-foreground">{meta}</p> : null}
        <h3 className="type-h3 mt-1">{experiment.title}</h3>
        {experiment.description ? (
          <p className="type-small mt-2 text-muted-foreground">{experiment.description}</p>
        ) : null}
      </div>
    </>
  );

  if (experiment.external_url) {
    return (
      <Reveal as="article" delay={(index % 3) * 60}>
        <a href={experiment.external_url} target="_blank" rel="noreferrer" className="group block">
          {content}
        </a>
      </Reveal>
    );
  }

  return (
    <Reveal as="article" delay={(index % 3) * 60}>
      <div className="group block">{content}</div>
    </Reveal>
  );
}

/**
 * Deliberately smaller-scale than ProjectList — a grid rather than large
 * editorial rows — so Experiments never competes visually with Selected Work.
 */
export function ExperimentsList({ experiments }: { experiments: Experiment[] }) {
  if (!experiments.length) return null;

  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {experiments.map((experiment, index) => (
        <ExperimentCard key={experiment.id} experiment={experiment} index={index} />
      ))}
    </div>
  );
}
