import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PersonalInfo {
  gender: string;
  name: string;
}

interface Preferences {
  personality: string[];
  hobbies: string[];
  loveLanguage: string;
}

interface PartnerPreferences {
  idealTraits: string[];
  partnerInterests: string[];
  relationshipGoals: string;
  firstImpression: string;
}

interface UserInfo {
  personalInfo: PersonalInfo;
  preferences: Preferences;
  partnerPreferences: PartnerPreferences;
}

interface ConfessionContextType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  confessionResult: string;
  setConfessionResult: React.Dispatch<React.SetStateAction<string>>;
  resetData: () => void;
}

const ConfessionContext = createContext<ConfessionContextType | undefined>(undefined);

export const ConfessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    personalInfo: {
      gender: '',
      name: '',
    },
    preferences: {
      personality: [],
      hobbies: [],
      loveLanguage: '',
    },
    partnerPreferences: {
      idealTraits: [],
      partnerInterests: [],
      relationshipGoals: '',
      firstImpression: '',
    },
  });

  const [confessionResult, setConfessionResult] = useState<string>('');

  const resetData = () => {
    setUserInfo({
      personalInfo: {
        gender: '',
        name: '',
      },
      preferences: {
        personality: [],
        hobbies: [],
        loveLanguage: '',
      },
      partnerPreferences: {
        idealTraits: [],
        partnerInterests: [],
        relationshipGoals: '',
        firstImpression: '',
      },
    });
    setConfessionResult('');
  };

  return (
    <ConfessionContext.Provider
      value={{
        userInfo,
        setUserInfo,
        confessionResult,
        setConfessionResult,
        resetData,
      }}
    >
      {children}
    </ConfessionContext.Provider>
  );
};

export const useConfession = () => {
  const context = useContext(ConfessionContext);
  if (!context) {
    throw new Error('useConfession must be used within a ConfessionProvider');
  }
  return context;
};