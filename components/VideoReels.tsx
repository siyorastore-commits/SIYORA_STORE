"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface VideoItem {
  id: number;
  src: string;
  poster?: string;
  label: string;
}

const VIDEOS: VideoItem[] = [
  { id: 1, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777549192/WhatsApp_Video_2026-04-30_at_16.51.50_tsf9ad.mp4", poster: "", label: "Sitara — Full Look" },
  { id: 2, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777579275/Video-728_qjjkzk.mp4", poster: "", label: "Spring Collection" },
  { id: 3, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777579275/Video-548_etgbxp.mp4", poster: "", label: "Behind the Seams" },
  { id: 4, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777579275/Video-811_fymg3k.mp4", poster: "", label: "Style It Your Way" },
  { id: 5, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777579274/Video-991_iulira.mp4", poster: "", label: "New Arrivals 2026" },
  { id: 6, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777579273/Video-975_rouboz.mp4", poster: "", label: "Siyora Reels" },
];

function MuteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function VideoCard({ video, onExpand }: { video: VideoItem; onExpand: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  const btnStyle: React.CSSProperties = {
    width: 30, height: 30, borderRadius: "50%",
    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "9/16", borderRadius: 14, overflow: "hidden", background: "#0d0d0d" }}>
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        muted loop playsInline preload="metadata"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 42%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 12, left: 12, color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 500, letterSpacing: "0.6px", pointerEvents: "none" }}>
        Powered by Siyora
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 6 }}>
        <button onClick={toggleMute} style={btnStyle}>{muted ? <MuteIcon /> : <VolumeIcon />}</button>
        <button onClick={(e) => { e.stopPropagation(); onExpand(); }} style={btnStyle}><ExpandIcon /></button>
      </div>
    </div>
  );
}

function VideoLightbox({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.93)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
        <video ref={videoRef} src={video.src} controls playsInline loop style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: 12, display: "block", background: "#000" }} />
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>
    </div>
  );
}

const arrowStyle: React.CSSProperties = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  zIndex: 10, width: 34, height: 34, borderRadius: "50%",
  background: "rgba(255,255,255,0.92)", border: "none",
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
};

export default function VideoReels() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section style={{ padding: "80px 0 60px", overflow: "hidden" }}>
        <div className="section-header" style={{ marginBottom: 40 }}>
          <span className="section-eyebrow">Style In Motion</span>
          <h2 className="section-title">See it <em>move</em></h2>
          <p className="section-sub">Tap the speaker icon to listen · Expand to watch full screen</p>
        </div>

        <div style={{ position: "relative" }}>
          <button ref={prevRef} style={{ ...arrowStyle, left: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button ref={nextRef} style={{ ...arrowStyle, right: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation === "object") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            grabCursor
            loop
            spaceBetween={10}
            speed={450}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              0:   { slidesPerView: 1.5 },
              480: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024:{ slidesPerView: 5 },
            }}
            style={{ paddingBottom: 36 }}
          >
            {VIDEOS.map((v) => (
              <SwiperSlide key={v.id}>
                <VideoCard video={v} onExpand={() => setActiveVideo(v)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {activeVideo && <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </>
  );
}
