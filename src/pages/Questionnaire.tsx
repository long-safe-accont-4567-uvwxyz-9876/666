import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfession } from '@/lib/context';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, setConfessionResult } = useConfession();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ['个人信息', '个人偏好', '伴侣偏好'];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'personality' || name === 'hobbies') {
      const checked = (e.target as HTMLInputElement).checked;
      setUserInfo(prev => {
        const currentValues = [...(prev.preferences[name as keyof typeof prev.preferences] as string[])];
        if (checked) {
          currentValues.push(value);
        } else {
          const index = currentValues.indexOf(value);
          if (index > -1) {
            currentValues.splice(index, 1);
          }
        }
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [name]: currentValues
          }
        };
      });
    } else if (name === 'loveLanguage') {
      setUserInfo(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value
        }
      }));
    }
  };

  const handlePartnerPreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idealTraits' || name === 'partnerInterests') {
      const checked = (e.target as HTMLInputElement).checked;
      setUserInfo(prev => {
        const currentValues = [...(prev.partnerPreferences[name as keyof typeof prev.partnerPreferences] as string[])];
        if (checked) {
          currentValues.push(value);
        } else {
          const index = currentValues.indexOf(value);
          if (index > -1) {
            currentValues.splice(index, 1);
          }
        }
        return {
          ...prev,
          partnerPreferences: {
            ...prev.partnerPreferences,
            [name]: currentValues
          }
        };
      });
    } else if (name === 'relationshipGoals') {
      setUserInfo(prev => ({
        ...prev,
        partnerPreferences: {
          ...prev.partnerPreferences,
          [name]: value
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 生成表白话语
      generateConfession();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateConfession = () => {
    // 简单的表白话语生成逻辑
    const { personalInfo, preferences, partnerPreferences } = userInfo;
    
    const confessionTemplates = [
      `嘿，我是${personalInfo.name}，一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。我喜欢${preferences.hobbies.join('、')}，我的爱语是${preferences.loveLanguage}。我理想中的另一半是${partnerPreferences.idealTraits.join('、')}的人，希望能和你一起${partnerPreferences.relationshipGoals}。你愿意做我的另一半吗？`,
      `你好呀！我叫${personalInfo.name}，是一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。平时我喜欢${preferences.hobbies.join('、')}，最在意的是${preferences.loveLanguage}。我觉得你就是我一直在找的人，因为你有${partnerPreferences.idealTraits.join('、')}这些我最看重的品质。我希望能和你一起${partnerPreferences.relationshipGoals}，你愿意给我这个机会吗？`,
      `${personalInfo.gender === 'male' ? '小姐姐' : '小哥哥'}你好！我是${personalInfo.name}，一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。我喜欢${preferences.hobbies.join('、')}，最享受的是${preferences.loveLanguage}。我理想的另一半就是像你这样${partnerPreferences.idealTraits.join('、')}的人，希望能和你一起${partnerPreferences.relationshipGoals}。可以和我在一起吗？`
    ];

    const randomTemplate = confessionTemplates[Math.floor(Math.random() * confessionTemplates.length)];
    
    // 存储表白结果到context
    setConfessionResult(randomTemplate);
    
    // 导航到结果页面
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">爱情问卷</h1>
        
        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-pink-600 h-2.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* 步骤指示器 */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {index + 1}
              </div>
              <span className={`mt-2 text-sm ${index <= currentStep ? 'text-pink-600 font-medium' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* 个人信息步骤 */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">个人信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="请输入你的名字"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={userInfo.personalInfo.gender === 'male'}
                      onChange={handlePersonalInfoChange}
                      className="mr-2"
                    />
                    <span>男</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={userInfo.personalInfo.gender === 'female'}
                      onChange={handlePersonalInfoChange}
                      className="mr-2"
                    />
                    <span>女</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 个人偏好步骤 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">个人偏好</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性格特点（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['开朗', '内向', '幽默', '细心', '温柔', '直率', '聪明', '善良'].map(trait => (
                    <label key={trait} className="flex items-center">
                      <input
                        type="checkbox"
                        name="personality"
                        value={trait}
                        checked={userInfo.preferences.personality.includes(trait)}
                        onChange={handlePreferenceChange}
                        className="mr-2"
                      />
                      <span>{trait}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">兴趣爱好（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['编程', '游戏', '音乐', '运动', '阅读', '旅行', '美食', '电影'].map(hobby => (
                    <label key={hobby} className="flex items-center">
                      <input
                        type="checkbox"
                        name="hobbies"
                        value={hobby}
                        checked={userInfo.preferences.hobbies.includes(hobby)}
                        onChange={handlePreferenceChange}
                        className="mr-2"
                      />
                      <span>{hobby}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">爱的语言</label>
                <select
                  name="loveLanguage"
                  value={userInfo.preferences.loveLanguage}
                  onChange={handlePreferenceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  <option value="陪伴">陪伴</option>
                  <option value="礼物">礼物</option>
                  <option value="赞美">赞美</option>
                  <option value="服务">服务</option>
                  <option value="身体接触">身体接触</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 伴侣偏好步骤 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">伴侣偏好</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">理想特质（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['温柔', '幽默', '聪明', '善良', '独立', '体贴', '有责任感', '有上进心'].map(trait => (
                    <label key={trait} className="flex items-center">
                      <input
                        type="checkbox"
                        name="idealTraits"
                        value={trait}
                        checked={userInfo.partnerPreferences.idealTraits.includes(trait)}
                        onChange={handlePartnerPreferenceChange}
                        className="mr-2"
                      />
                      <span>{trait}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">伴侣兴趣（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['编程', '游戏', '音乐', '运动', '阅读', '旅行', '美食', '电影'].map(interest => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        name="partnerInterests"
                        value={interest}
                        checked={userInfo.partnerPreferences.partnerInterests.includes(interest)}
                        onChange={handlePartnerPreferenceChange}
                        className="mr-2"
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">恋爱目标</label>
                <select
                  name="relationshipGoals"
                  value={userInfo.partnerPreferences.relationshipGoals}
                  onChange={handlePartnerPreferenceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  <option value="相互陪伴">相互陪伴</option>
                  <option value="共同成长">共同成长</option>
                  <option value="组建家庭">组建家庭</option>
                  <option value="长期稳定">长期稳定</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium ${currentStep === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            上一步
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? '生成表白' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;