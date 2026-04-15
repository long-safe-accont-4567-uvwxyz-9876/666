import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfession } from '@/lib/context';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { confessionResult, resetData } = useConfession();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // 生成随机的emoji表情
  const loveEmojis = ['💖', '💕', '💗', '💓', '💝', '💘', '💌', '💋', '😍', '🥰'];
  const [randomEmoji, setRandomEmoji] = useState(loveEmojis[Math.floor(Math.random() * loveEmojis.length)]);

  useEffect(() => {
    // 3秒后停止显示庆祝效果
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // 每隔2秒更换emoji
    const emojiTimer = setInterval(() => {
      setRandomEmoji(loveEmojis[Math.floor(Math.random() * loveEmojis.length)]);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(emojiTimer);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(confessionResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '我的表白话语',
          text: confessionResult,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      // 回退到复制功能
      handleCopy();
    }
  };

  const handleRetry = () => {
    resetData();
    navigate('/questionnaire');
  };

  const handleBackHome = () => {
    resetData();
    navigate('/');
  };

  // 生成庆祝效果的函数
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8E53', '#6A0572'][Math.floor(Math.random() * 5)],
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {renderConfetti()}
      
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 relative z-10">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          表白话语生成结果
          <span className="inline-block animate-bounce ml-2">{randomEmoji}</span>
        </h1>

        <div className="bg-gradient-to-r from-pink-100 to-teal-100 rounded-xl p-8 mb-8 border border-pink-200 transform transition-transform duration-500 hover:scale-105">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">{randomEmoji}</div>
            <p className="text-xl leading-relaxed mb-4 font-medium text-gray-800">{confessionResult}</p>
            <div className="text-5xl mt-4 animate-pulse">{randomEmoji}</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {copied ? '已复制！' : '复制到剪贴板'}
            <span>{copied ? '✅' : '📋'}</span>
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            分享
            <span>📤</span>
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2 shadow-sm hover:shadow"
          >
            重新生成
            <span>🔄</span>
          </button>
          <button
            onClick={handleBackHome}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2 shadow-sm hover:shadow"
          >
            返回首页
            <span>🏠</span>
          </button>
        </div>

        {/* 趣味提示 */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
          <p className="text-yellow-800 text-sm">💡 提示：表白时加上真诚的眼神和微笑，效果会更好哦！</p>
        </div>
      </div>
    </div>
  );
};

export default Result;