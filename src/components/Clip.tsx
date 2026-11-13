import { useRef } from "react";
import { Pause, Play } from "lucide-react";
import { useClipPlayback } from "../hooks";

export const MEDIA = `${import.meta.env.BASE_URL}media`;

/**
 * A real product clip in the app's window frame. It plays only while visible,
 * never under reduced motion unless asked, and always has a pause button.
 */
export function Clip({
  name,
  label,
  pauseLabel,
  playLabel,
  className = "",
  eager = false,
}: {
  name: string;
  label: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const { playing, toggle } = useClipPlayback(ref);
  return (
    <figure className={`window ${className}`}>
      <div className="window-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="window-body">
        <video
          ref={ref}
          src={`${MEDIA}/${name}.mp4`}
          poster={`${MEDIA}/${name}.webp`}
          muted
          loop
          playsInline
          preload={eager ? "auto" : "none"}
          width={1600}
          height={900}
          aria-label={label}
        />
        <button className="clip-toggle" type="button" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        </button>
      </div>
    </figure>
  );
}
