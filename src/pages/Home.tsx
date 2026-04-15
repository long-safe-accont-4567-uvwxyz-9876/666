import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-4 text-pink-600">
            表白自动生成器
            <span className="inline-block animate-bounce ml-2">💖</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            专为内向腼腆的技术人员设计，通过有趣的问卷生成定制化表白话语
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-pink-600 text-white rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
          >
            开始表白之旅
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">关于我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pink-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">我们的目标</h3>
              <p className="text-gray-600">帮助技术人员克服表白障碍，用最真诚的话语表达爱意</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">如何工作</h3>
              <p className="text-gray-600">通过填写有趣的问卷，系统会生成独一无二的表白话语</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">为什么选择我们</h3>
              <p className="text-gray-600">个性化定制，有趣幽默，直接复制发送，让表白变得简单</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">© 2026 表白自动生成器 | 让爱情更简单</p>
        </div>
      </div>
    </div>
  );
}