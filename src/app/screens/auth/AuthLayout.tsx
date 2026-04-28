import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './WelcomeScreen';
import { PhoneScreen } from './PhoneScreen';
import { OTPScreen } from './OTPScreen';
import { ProfileSetupScreen } from './ProfileSetupScreen';

type Screen = 'welcome' | 'phone' | 'otp' | 'profile';

export function AuthLayout() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const handleNavigate = (screen: Screen | string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    if (currentScreen === 'phone') setCurrentScreen('welcome');
    if (currentScreen === 'otp') setCurrentScreen('phone');
    if (currentScreen === 'profile') setCurrentScreen('otp');
  };

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'welcome' && (
        <WelcomeScreen key="welcome" onNavigate={handleNavigate} />
      )}
      {currentScreen === 'phone' && (
        <PhoneScreen key="phone" onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentScreen === 'otp' && (
        <OTPScreen key="otp" onNavigate={handleNavigate} onBack={handleBack} />
      )}
      {currentScreen === 'profile' && (
        <ProfileSetupScreen key="profile" onNavigate={handleNavigate} />
      )}
    </AnimatePresence>
  );
}
