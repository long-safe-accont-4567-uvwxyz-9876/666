import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfession } from '@/lib/context';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { confessionResult, resetData } = useConfession();
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">表白话语生成结果</h1>
        
        <div className="bg-gradient-to-r from-pink-100 to-teal-100 rounded-xl p-8 mb-8 border border-pink-200">
          <div className="text-center">
            <div className="text-5xl mb-4">💖</div>
            <p className="text-xl leading-relaxed mb-4">{confessionResult}</p>
            <div className="text-5xl mt-4">💕</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            {copied ? '已复制！' : '复制到剪贴板'}
            <span>{copied ? '✅' : '📋'}</span>
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            分享
            <span>📤</span>
          </button>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            重新生成
            <span>🔄</span>
          </button>
          <button
            onClick={handleBackHome}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            返回首页
            <span>🏠</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;