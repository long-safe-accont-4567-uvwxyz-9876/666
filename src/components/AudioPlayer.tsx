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
        {/* 请将下方的音频URL替换为您的《恋愛サーキュレーション》音频文件的实际URL */}
        {/* 您可以上传音频文件到云存储服务（如GitHub Pages、Vercel、Netlify等）获取公共URL */}
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        您的浏览器不支持音频元素。
      </audio>
    </div>
  );
}
