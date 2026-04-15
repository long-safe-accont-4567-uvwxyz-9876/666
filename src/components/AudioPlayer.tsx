import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Failed to play audio:', error);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg z-50">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <audio
        ref={audioRef}
        loop
        volume={0.3}
        className="hidden"
      >
        {/* 使用在线音频资源 */}
        <source src="https://example.com/恋愛サーキュレーション.mp3" type="audio/mpeg" />
        您的浏览器不支持音频元素。
      </audio>
    </div>
  );
}
