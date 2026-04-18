import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfession } from '@/lib/context';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, setConfessionResult, setPersonalityAnalysis } = useConfession();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ['个人信息', '性格测试', '兴趣爱好', '爱情观', '伴侣偏好'];

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
    if (name === 'personality' || name === 'hobbies' || name === 'traits' || name === 'loveStyle') {
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
    } else if (name === 'loveLanguage' || name === 'relationshipStyle') {
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
    } else if (name === 'relationshipGoals' || name === 'firstImpression') {
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

  // 人格分析函数
  const analyzePersonality = () => {
    const { preferences, partnerPreferences } = userInfo;
    
    // 基于用户回答分析人格类型
    const personalityTypes = [
      { type: '浪漫理想型', traits: ['温柔', '感性', '浪漫', '情感丰富'], match: (p: any) => p.loveStyle.includes('浪漫型') || p.personality.includes('温柔') },
      { type: '理性务实型', traits: ['理性', '逻辑思维', '务实', '有责任感'], match: (p: any) => p.traits.includes('理性') || p.traits.includes('逻辑思维') || p.loveStyle.includes('务实型') },
      { type: '活力冒险型', traits: ['开朗', '勇敢', '自信', '创造力'], match: (p: any) => p.personality.includes('开朗') || p.traits.includes('勇敢') || p.traits.includes('创造力') },
      { type: '稳定可靠型', traits: ['耐心', '细心', '善良', '谦虚'], match: (p: any) => p.traits.includes('耐心') || p.traits.includes('细心') || p.loveStyle.includes('稳定型') },
      { type: '自由独立型', traits: ['独立', '自信', '创造力', '直率'], match: (p: any) => p.traits.includes('独立') || p.loveStyle.includes('自由型') || p.personality.includes('直率') }
    ];

    // 确定人格类型
    let personalityType = personalityTypes.find(type => type.match(preferences));
    if (!personalityType) {
      personalityType = personalityTypes[Math.floor(Math.random() * personalityTypes.length)];
    }

    // 生成优点和缺点
    const strengthsMap: { [key: string]: string[] } = {
      '浪漫理想型': ['情感丰富', '温柔体贴', '善于表达爱意', '富有创造力'],
      '理性务实型': ['逻辑清晰', '责任感强', '可靠稳定', '善于解决问题'],
      '活力冒险型': ['充满活力', '勇敢自信', '富有创造力', '善于社交'],
      '稳定可靠型': ['耐心细致', '善良体贴', '责任感强', '值得信赖'],
      '自由独立型': ['独立自信', '创造力强', '直率真诚', '适应性强']
    };

    const weaknessesMap: { [key: string]: string[] } = {
      '浪漫理想型': ['有时过于感性', '可能理想化爱情', '情绪波动较大', '容易受伤'],
      '理性务实型': ['可能过于理性', '不善于表达情感', '有时过于严肃', '对自己要求过高'],
      '活力冒险型': ['可能缺乏耐心', '有时过于冲动', '注意力容易分散', '可能忽视细节'],
      '稳定可靠型': ['可能过于保守', '不善于创新', '有时过于谨慎', '可能缺乏激情'],
      '自由独立型': ['可能过于自我', '不善于妥协', '有时过于直率', '可能忽视他人感受']
    };

    const strengths = strengthsMap[personalityType.type] || ['有爱心', '善良', '真诚'];
    const weaknesses = weaknessesMap[personalityType.type] || ['偶尔犹豫', '有时敏感', '追求完美'];

    // 分析恋爱风格
    const loveStyle = preferences.loveStyle.join('、') || '平衡型';

    // 分析与理想伴侣的兼容性
    const compatibility = `与理想中的${partnerPreferences.idealTraits.join('、')}型伴侣兼容性较高，你们可以${partnerPreferences.relationshipGoals}，建立${preferences.relationshipStyle}的关系。`;

    return {
      type: personalityType.type,
      traits: personalityType.traits,
      strengths,
      weaknesses,
      loveStyle,
      compatibility
    };
  };

  const generateConfession = () => {
    // 简单的表白话语生成逻辑
    const { personalInfo, preferences, partnerPreferences } = userInfo;

    const confessionTemplates = [
      `嘿，我是${personalInfo.name}，一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。我对你${partnerPreferences.firstImpression}，我喜欢${preferences.hobbies.join('、')}，我的爱语是${preferences.loveLanguage}，恋爱风格是${preferences.loveStyle.join('、')}。我理想中的另一半是${partnerPreferences.idealTraits.join('、')}的人，希望能和你一起${partnerPreferences.relationshipGoals}，建立${preferences.relationshipStyle}的关系。你愿意做我的另一半吗？`,
      `你好呀！我叫${personalInfo.name}，是一个${preferences.personality.join('、')}且${preferences.traits.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。第一次见到你时${partnerPreferences.firstImpression}，平时我喜欢${preferences.hobbies.join('、')}，最在意的是${preferences.loveLanguage}。我觉得你就是我一直在找的人，因为你有${partnerPreferences.idealTraits.join('、')}这些我最看重的品质。我希望能和你一起${partnerPreferences.relationshipGoals}，你愿意给我这个机会吗？`,
      `${personalInfo.gender === 'male' ? '小姐姐' : '小哥哥'}你好！我是${personalInfo.name}，一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。对你的第一印象是${partnerPreferences.firstImpression}，我喜欢${preferences.hobbies.join('、')}，最享受的是${preferences.loveLanguage}。我理想的另一半就是像你这样${partnerPreferences.idealTraits.join('、')}的人，希望能和你一起${partnerPreferences.relationshipGoals}。可以和我在一起吗？`,
      `亲爱的，我是${personalInfo.name}。从第一次见到你时${partnerPreferences.firstImpression}，我就被你吸引了。我是一个${preferences.personality.join('、')}且${preferences.traits.join('、')}的人，喜欢${preferences.hobbies.join('、')}，我的爱语是${preferences.loveLanguage}，恋爱风格是${preferences.loveStyle.join('、')}。你身上的${partnerPreferences.idealTraits.join('、')}品质让我着迷，我希望能和你一起${partnerPreferences.relationshipGoals}，建立${preferences.relationshipStyle}的关系。做我的女朋友/男朋友好吗？`,
      `你好，我是${personalInfo.name}。对你的第一印象是${partnerPreferences.firstImpression}，我觉得你很特别。我是一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}，喜欢${preferences.hobbies.join('、')}。我看重${preferences.loveLanguage}，希望能找到一个${partnerPreferences.idealTraits.join('、')}的另一半，和TA一起${partnerPreferences.relationshipGoals}。你愿意和我一起吗？`,
      `嗨，${personalInfo.gender === 'male' ? '女神' : '男神'}！我是${personalInfo.name}，一个${preferences.personality.join('、')}的${personalInfo.gender === 'male' ? '男生' : '女生'}。第一次见到你时${partnerPreferences.firstImpression}，我就知道你是我要找的人。我喜欢${preferences.hobbies.join('、')}，我的爱语是${preferences.loveLanguage}，我希望能和你建立${preferences.relationshipStyle}的关系，一起${partnerPreferences.relationshipGoals}。你愿意和我在一起吗？`
    ];

    const randomTemplate = confessionTemplates[Math.floor(Math.random() * confessionTemplates.length)];
    
    // 生成人格分析
    const analysis = analyzePersonality();
    
    // 存储结果到context
    setConfessionResult(randomTemplate);
    setPersonalityAnalysis(analysis);
    
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

        {/* 性格测试步骤 */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">性格测试</h2>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">核心特质（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['勇敢', '自信', '谦虚', '耐心', '创造力', '逻辑思维', '情感丰富', '理性'].map(trait => (
                    <label key={trait} className="flex items-center">
                      <input
                        type="checkbox"
                        name="traits"
                        value={trait}
                        checked={userInfo.preferences.traits.includes(trait)}
                        onChange={handlePreferenceChange}
                        className="mr-2"
                      />
                      <span>{trait}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 兴趣爱好步骤 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">兴趣爱好</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">兴趣爱好（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['编程', '游戏', '音乐', '运动', '阅读', '旅行', '美食', '电影', '摄影', '绘画', '写作', '手工'].map(hobby => (
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
            </div>
          </div>
        )}

        {/* 爱情观步骤 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">爱情观</h2>

            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">恋爱风格（可多选）</label>
                <div className="grid grid-cols-2 gap-2">
                  {['浪漫型', '务实型', '激情型', '稳定型', '自由型', '占有型'].map(style => (
                    <label key={style} className="flex items-center">
                      <input
                        type="checkbox"
                        name="loveStyle"
                        value={style}
                        checked={userInfo.preferences.loveStyle.includes(style)}
                        onChange={handlePreferenceChange}
                        className="mr-2"
                      />
                      <span>{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关系模式</label>
                <select
                  name="relationshipStyle"
                  value={userInfo.preferences.relationshipStyle}
                  onChange={handlePreferenceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  <option value="平等互助">平等互助</option>
                  <option value="照顾与被照顾">照顾与被照顾</option>
                  <option value="共同成长">共同成长</option>
                  <option value="相互依赖">相互依赖</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 伴侣偏好步骤 */}
        {currentStep === 4 && (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">对TA的第一印象</label>
                <select
                  name="firstImpression"
                  value={userInfo.partnerPreferences.firstImpression}
                  onChange={handlePartnerPreferenceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">请选择</option>
                  <option value="一见钟情">一见钟情</option>
                  <option value="慢慢喜欢">慢慢喜欢</option>
                  <option value="觉得有趣">觉得有趣</option>
                  <option value="很有才华">很有才华</option>
                  <option value="温柔体贴">温柔体贴</option>
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