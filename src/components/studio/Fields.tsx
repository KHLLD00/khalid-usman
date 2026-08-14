import { useRef, useState } from "react";

import { MediaLibrary } from "@/components/studio/MediaLibrary";
import { imageSrc, type GalleryImage } from "@/lib/cms";
import {
  deleteImage,
  isStoragePath,
  uploadImage,
  validateImageFile,
  type MediaFolder,
} from "@/lib/media";
import { describeSupabaseError } from "@/lib/studio";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="type-label text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="type-meta mt-1 block text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputClass = "mt-2 w-full border bg-transparent px-3 py-2 text-sm outline-none";

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} {...(hint ? { hint } : {})}>
      <input
        value={value}
        placeholder={placeholder ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 5,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} {...(hint ? { hint } : {})}>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} leading-relaxed`}
      />
    </Field>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-current"
      />
      <span className="type-meta">{label}</span>
    </label>
  );
}

export function ImagePicker({
  label,
  value,
  onChange,
  folder = "blocks",
  altValue,
  onAltChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  folder?: MediaFolder;
  altValue?: string;
  onAltChange?: (value: string) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [library, setLibrary] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = imageSrc(value);

  async function handleFile(file: File | undefined) {
    if (!file || busy) return;
    setError(null);
    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    try {
      const previous = value;
      const path = await uploadImage(file, { folder });
      onChange(path);
      if (isStoragePath(previous)) await deleteImage(previous).catch(() => {});
    } catch (uploadError) {
      setError(describeSupabaseError(uploadError));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await deleteImage(value);
      onChange(null);
    } catch (removeError) {
      setError(describeSupabaseError(removeError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`border p-4 transition-opacity ${dragging ? "border-foreground" : ""} ${busy ? "opacity-60" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        void handleFile(event.dataTransfer.files?.[0]);
      }}
    >
      <span className="type-label text-muted-foreground">{label}</span>

      {preview ? (
        <img
          src={preview}
          alt={altValue ?? ""}
          className="mt-3 aspect-[16/10] w-full bg-secondary object-cover"
        />
      ) : (
        <div className="mt-3 flex aspect-[16/10] w-full items-center justify-center bg-secondary">
          <span className="type-meta text-muted-foreground">
            {busy ? "Uploading…" : "Drop an image here or upload below"}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(event) => void handleFile(event.target.files?.[0])}
        className="sr-only"
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="type-meta link-underline disabled:opacity-50"
        >
          {value ? "Replace" : "Upload"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setLibrary(true)}
          className="type-meta link-underline disabled:opacity-50"
        >
          Choose existing
        </button>
        {value ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove()}
            className="type-meta link-underline text-muted-foreground disabled:opacity-50"
          >
            Remove
          </button>
        ) : null}
        {busy ? <span className="type-meta text-muted-foreground">Uploading…</span> : null}
      </div>

      {hint ? <p className="type-meta mt-2 text-muted-foreground">{hint}</p> : null}

      {onAltChange ? (
        <TextInput label="Alt text" value={altValue ?? ""} onChange={onAltChange} />
      ) : null}

      {error ? (
        <p className="type-meta mt-2">
          {error}{" "}
          <button
            type="button"
            onClick={() => setError(null)}
            className="link-underline text-muted-foreground"
          >
            Dismiss
          </button>
        </p>
      ) : null}

      {library ? (
        <MediaLibrary
          onClose={() => setLibrary(false)}
          onSelect={(path) => {
            onChange(path);
            setLibrary(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function GalleryEditor({
  label,
  images,
  onChange,
  folder = "blocks",
}: {
  label: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  folder?: MediaFolder;
}) {
  function update(index: number, patch: Partial<GalleryImage>) {
    onChange(images.map((image, i) => (i === index ? { ...image, ...patch } : image)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    if (item) next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="type-label text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...images, { url: "", alt: "", caption: "", aspect: "auto" }])}
          className="type-meta link-underline"
        >
          Add image
        </button>
      </div>

      {images.map((image, index) => (
        <div key={index} className="space-y-3 border p-4">
          <div className="flex items-center justify-between">
            <span className="type-meta text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => move(index, -1)}
                className="type-meta link-underline"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                className="type-meta link-underline"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="type-meta link-underline text-muted-foreground"
              >
                Remove
              </button>
            </div>
          </div>

          <ImagePicker
            label="Image"
            folder={folder}
            value={image.url || null}
            onChange={(url) => update(index, { url: url ?? "" })}
            altValue={image.alt ?? ""}
            onAltChange={(alt) => update(index, { alt })}
          />
          <TextInput
            label="Caption"
            value={image.caption ?? ""}
            onChange={(caption) => update(index, { caption })}
          />
          <Field label="Aspect ratio">
            <select
              value={image.aspect ?? "auto"}
              onChange={(event) =>
                update(index, {
                  aspect: event.target.value as NonNullable<GalleryImage["aspect"]>,
                })
              }
              className={inputClass}
            >
              <option value="auto">Original</option>
              <option value="wide">Wide 16:9</option>
              <option value="square">Square</option>
              <option value="tall">Tall 3:4</option>
            </select>
          </Field>
        </div>
      ))}
    </div>
  );
}

export { inputClass };
