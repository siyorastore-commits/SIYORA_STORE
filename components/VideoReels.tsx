"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";

interface VideoItem {
  id: number;
  src: string;
  poster?: string;
  label: string;
}

const VIDEOS: VideoItem[] = [
  { id: 1, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1777549192/WhatsApp_Video_2026-04-30_at_16.51.50_tsf9ad.mp4", poster: "", label: "Sitara — Full Look" },
  { id: 2, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1/siyora_reel_2.mp4", poster: "", label: "Spring Collection" },
  { id: 3, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1/siyora_reel_3.mp4", poster: "", label: "Behind the Seams" },
  { id: 4, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1/siyora_reel_4.mp4", poster: "", label: "Style It Your Way" },
  { id: 5, src: "https://res.cloudinary.com/dghggvtdn/video/upload/v1/siyora_reel_5.mp4", poster: "", label: "New Arrivals 2026" },
];

function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "prev" ? "left" : "right"]: 12,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "#fff",
        border: "none",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.12)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "box-shadow 0.2s, transform 0.2s",
        flexShrink: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E91E8C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

function VideoCard({ video, onClick }: { video: VideoItem; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() { videoRef.current?.play(); }
  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "9/16",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        background: "#1a0a08",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(24,10,8,0.75) 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 16, left: 16, right: 16,
        color: "#fff", fontSize: 13, fontWeight: 600,
        fontFamily: "var(--sans)", letterSpacing: "0.5px",
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}>
        {video.label}
      </div>
    </div>
  );
}

function VideoLightbox({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    videoRef.current?.play();
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(10,4,3,0.65)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        padding: "5.5vh 10vw",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "80vw", maxWidth: 520, height: "89vh",
          borderRadius: 24, overflow: "hidden", position: "relative",
          background: "#000", boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          controls playsInline loop
          style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
            fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
        <div style={{
          position: "absolute", bottom: 20, left: 20,
          color: "#fff", fontSize: 14, fontWeight: 600,
          fontFamily: "var(--sans)", textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          pointerEvents: "none",
        }}>
          {video.label}
        </div>
      </div>
    </div>
  );
}

export default function VideoReels() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <>
      <section style={{ padding: "80px 0 60px" }}>
        <div className="section-header" style={{ marginBottom: 40 }}>
          <span className="section-eyebrow">Style In Motion</span>
          <h2 className="section-title">See it <em>move</em></h2>
          <p className="section-sub">Hover to preview · Click to watch</p>
        </div>

        <div style={{ position: "relative" }}>
          <NavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />

          <Swiper
            modules={[Autoplay]}
            onSwiper={(s) => { swiperRef.current = s; }}
            grabCursor
            centeredSlides
            loop
            slidesPerView="auto"
            spaceBetween={20}
            speed={500}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            style={{ paddingTop: 8, paddingBottom: 16 }}
          >
            {VIDEOS.map((v) => (
              <SwiperSlide key={v.id} style={{ width: "clamp(200px, 58vw, 260px)" }}>
                {({ isActive }: { isActive: boolean }) => (
                  <div style={{
                    transform: isActive ? "scale(1)" : "scale(0.84)",
                    opacity: isActive ? 1 : 0.5,
                    transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
                  }}>
                    <VideoCard video={v} onClick={() => setActiveVideo(v)} />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <NavButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
        </div>
      </section>

      {activeVideo && (
        <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
