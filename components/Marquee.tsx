import { MARQUEE_ITEMS } from "@/lib/data";

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="mq-wrap">
      <div className="mq-track">
        {doubled.map((text, i) => (
          <span key={i} className="mq-item">
            {text} <span className="mq-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
